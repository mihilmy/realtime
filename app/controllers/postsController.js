app.controller('postsController', ['$scope','$rootScope', '$location', '$firebaseArray',function($scope, $rootScope, $location, $firebaseArray) {
	var db = firebase.database().ref();
	
	$scope.create = function() {
		var postsRef = db.child('posts');
		//Create the post id.
		var postId = postsRef.push().key;
		//Add the content of the post in the database.
		postsRef.child(postId).set({
			id: postId,
			pid: $rootScope.currentUser.id,
			title: $scope.post.title,
			summary: $scope.post.summary,
			category: $scope.post.category,
			location: $scope.post.location,
			start: $scope.post.start,
			end: $scope.post.end,
			createdAt: firebase.database.ServerValue.TIMESTAMP,
			content: $scope.post.content
		});
		$location.path('/');
	}
	
	$scope.index = function() {
		console.log(1);
		var postsRef = db.child('posts');
		var posts = $firebaseArray(postsRef);
		$scope.posts = posts;
	}
	
	
	
	
	
}]);