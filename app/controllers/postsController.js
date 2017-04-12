app.controller('postsController', ['$scope','$rootScope','$routeParams','$location','$firebaseObject' ,'$firebaseArray',function($scope, $rootScope,$routeParms, $location, $firebaseObject, $firebaseArray) {
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
			pid: $rootScope.currentUser.id,
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
	
	$scope.index = function() {
		var posts = $firebaseArray(postsRef);
		$scope.posts = posts;
	}
	
	$scope.show = function() {
		var postRef = postsRef.child($routeParms.id);
		var postObj = $firebaseObject(postRef);
		postObj.$loaded().then(function() {
			var authorRef = db.child('users').child(postObj.pid);
			var authorObj = $firebaseObject(authorRef);
			$scope.author = authorObj;
			$scope.isOwner = $rootScope.currentUser.id == postObj.pid;
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
		var likesRef = db.child('favorites').child($rootScope.currentUser.id);
		
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
		
		var favRef = db.child('favorites').child($rootScope.currentUser.id).child(postID);
		var fav = $firebaseObject(favRef);
	}
	
		
}]);