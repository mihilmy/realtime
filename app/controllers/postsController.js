app.controller('postsController', 
	['$scope','$rootScope','$routeParams','$location','$firebaseObject' ,'$firebaseArray', '$uibModal','$log',
	 function($scope, $rootScope,$routeParms, $location, $firebaseObject, $firebaseArray, $uibModal, $log) {
	var db = firebase.database().ref();
	var postsRef = db.child('posts');
		
	//This is a variable that includes all our current categories 
	//and their index corresponds to what is stored on the database.
	var categories = [ 
 "Arts & Humanities",
 "Beauty & Style",
 "Business & Finance",
 "Cars & Transportation",
 "Computers & Internet",
 "Consumer Electronics",
 "Dining Out",
 "Education & Reference",
 "Entertainment & Music",
 "Environment",
 "Family & Relationships",
 "Food & Drink",
 "Games & Recreation",
 "Health",
 "Home & Garden",
 "Local Businesses",
 "News & Events",
 "Pets",
 "Politics & Government",
 "Pregnancy & Parenting",
 "Science & Mathematics",
 "Social Science",
 "Society & Culture",
 "Sports",
 "Travel",
 "Yahoo Products"];
	
  var date = new Date();
	date.setSeconds(0,0);
	var tmrw = new Date();
	tmrw.setDate(tmrw.getDate() + 1);
	tmrw.setSeconds(0,0);
	
	$scope.post = { start: date, end: tmrw}
	$scope.isCollapsed = false;
		 
	$scope.create = function() {
		if(!$scope.post.content) {
			$rootScope.postsError = "Please add the post content";
			return;
		}
		//Create the post id.
		var postId = postsRef.push().key;
		//Add the content of the post in the database.
		postsRef.child(postId).set({
			id: postId,
			pid: $rootScope.currentUser.$id,
			title: $scope.post.title,
			summary: $scope.post.summary,
			category: parseInt($scope.post.category),
			location: $scope.post.location.formatted_address,
			start: $scope.post.start.toString(),
			end: $scope.post.end.toString(),
			createdAt: firebase.database.ServerValue.TIMESTAMP,
			content: $scope.post.content
		});
		
		$rootScope.postsError = "";
		$location.path('/');
	}
	
	
	/*
	@return
	Uses the search tempelate to create a modal dialog to be used for users to search.
	Nothing to be done by ng-route here.
	A dependency called $uibModal was added in the function definition above.
	*/
	
	$scope.openModal = function () {
		
    $scope.modal = $uibModal.open({
      templateUrl: 'views/posts/search.html',
      controller: 'postsController',
			backdrop: true,
			scope: $scope
    });
	
	}
	
	/*
	@return 
	Closes the modal. Throws a possibly unhandeled rejection.
	*/
	$scope.closeModal = function () {
		$scope.modal.dismiss('dismiss');
	}
	
	/*
	@return
	Temporary function to filter out posts on the index page after using the 
	query object attained from the modal dialog.
	*/
	
	$scope.index = function() {
		//If empty query is supplied return everything.
		var postsArray = [];
			//Order the posts by createdAt key such that newer posts are added to the top.
		postsRef.orderByChild('createdAt').on('value', function(dataSnapshot) {
			dataSnapshot.forEach(
				function(dataSnapshot) {
					postsArray.unshift(dataSnapshot.val());
				}
			);
		});
		
		console.log(postsArray);	
		return postsArray;
		
	}
	
	$scope.search = function() {
		if ($scope.modal) {
			$scope.modal.close('search');
		}
		var postsArray = [];
		//Define our search variables
		var title = $scope.query.title;
		var category = $scope.query.category;
		var location = $scope.query.location;
		var start = $scope.query.start;
		var end = $scope.query.end;
		
		postsRef.on('value', function(data) {
			data.forEach( function(data) {
				var postObj = data.val();
				var include = true;
				//Title is defined but not equal to post.
				if (title && postObj.title.toLowerCase() != title.toLowerCase()) {
					include = false;
				}
				//Category is defined but not equal to post.
				if (category && postObj.category != category) {
					include = false;
				}
				//Location is defined but not equal to post.
				if (location && postObj.location != location.formatted_address) {
					include = false;
				}
				//Start date is defined but not equal to post.
				if (start && postObj.start != start) {
					include = false;
				}
				//End date is defined but not equal to post.
				if (end && postObj.end != end) {
					include = false;
				}
				//Include flag was not caught in any of the above cases which means that it should be added to postsArray
				if (include) {
					postsArray.push(postObj);
				}
				
			});
			
		});
		
		console.log(postsArray);
	}
	
	$scope.show = function() {
		var postRef = postsRef.child($routeParms.id);
		var postObj = $firebaseObject(postRef);
		postObj.$loaded().then(function() {
			var authorRef = db.child('users').child(postObj.pid);
			var authorObj = $firebaseObject(authorRef);
			$scope.author = authorObj;
			$scope.isOwner = $rootScope.currentUser.$id == postObj.pid;
		});

		$scope.post = postObj;
	}
	
	$scope.delete = function(key) {
		postsRef.child(key).remove();
		$location.path('/');
	}
	/*
	@params
	postID: The post id you want to favorite.
	
	@return
	Gets a reference to the users current favorites and then uses a transaction to update the data there.
	The transaction function checks the data currently there if there is no data then it's null.
	If there is we abort the transaction by return whcih delegates to another method to remove.
	*/
	$scope.favorite = function(postID) {
		var likesRef = db.child('favorites').child($rootScope.currentUser.$id);
		
		likesRef.child(postID).transaction(function(currentData) {
			if (currentData === null) {
				console.log('Fav');
				return true;
			} else {
				console.log('Unfav');
				return;
			}
		}, function(error, committed, snapshot) {
			if (error) {
				console.log('Transaction failed abnormally!', error);
			} else if (!committed) {
				likesRef.child(postID).remove();
			} else {
				console.log('Like added!');
			}
		});
	}
	/*
	@params
	postID: The post id you want to favorite.
	
	@return
	Gets a reference to the users current favorites and then uses a transaction to
	check if the current post is favorited by the user or not.
	*/
	$scope.isFavorite = function(postID) {
		
		var favRef = db.child('favorites').child($rootScope.currentUser.$id).child(postID);
		var fav = $firebaseObject(favRef);
	}
	
		
}]);