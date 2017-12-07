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
	
	$scope.post = { start: date, end: tmrw};
	
	var postId,imgCount;
		 
	$scope.create = function() {
		if(!$scope.post.content) {
			$rootScope.postsError = "Please add the post content";
			return;
		}
		//Create the post id, if it has not been already created from the image upload.
		if (!postId) {
			postId = postsRef.push().key;
		} 

		let el = document.createElement('html');
		el.innerHTML = $scope.post.content;

		let links = el.getElementsByTagName('a');

		for (i = 0; i < links.length; i++) {
			let link = links[i];
			let actual_url = link['href'];
			let figure = link['children'][0];
			if (figure) {
				// figure will be undefined for a link, but will have the image tag of an actual image.
				figure.innerHTML = "<img src=\"" + actual_url + "\">";				
			}
		}

		content_img_fixed = el.getElementsByTagName("BODY")[0].innerHTML;

		console.log(content_img_fixed);
		console.log($scope.post.content);


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
			content: content_img_fixed
		});
		
		postId = undefined;
		
		$rootScope.postsError = "";
		$location.path('/');
	}
	/*
	@params
		e - editor 
		
	This is a method that handles any uploads done by the trix editor in the new.html file.
	It uses firebase's storage reference and sets then retrievs the url from the storage bucket.
	Finally, setting the <img> tag's src attribute to that retreived URL.
	*/
	$scope.trixAttachmentAdd = function(e) {
		var attachment = e.attachment;
		
		if (!postId) {
			postId = postsRef.push().key;
			console.log(postId);
			imgCount = 0;
		} 
		
		if (attachment.file) {
			let storageRef = firebase.storage().ref('posts/' + postId + '/' + imgCount);
	
			storageRef.put(attachment.file).then(function(snapshot) {
				console.log(e);
				
				imgCount++;
				return attachment.setAttributes({
					url: snapshot.downloadURL,
					href: snapshot.downloadURL,
					src: snapshot.downloadURL,
					
				});
				
			});
		}
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