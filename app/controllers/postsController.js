app.controller('postsController', ['$scope','$rootScope','$routeParams','$location','$firebaseObject' ,'$firebaseArray',function($scope, $rootScope,$routeParms, $location, $firebaseObject, $firebaseArray) {
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
		var postsRef = db.child('posts');
		var posts = $firebaseArray(postsRef);
		$scope.posts = posts;
	}
	
	
	$scope.show = function() {
		var postRef = db.child('posts').child($routeParms.id);
		var postObj = $firebaseObject(postRef);
		postObj.$loaded().then(function() {
			var authorRef = db.child('publishers').child(postObj.pid);
			var authorObj = $firebaseObject(authorRef);
			$scope.author = authorObj;
		});
		$scope.post = postObj;
	}
	
	
}]);