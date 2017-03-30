app.controller('postsController', ['$scope','$rootScope','$routeParams','$location','$firebaseObject' ,'$firebaseArray',function($scope, $rootScope,$routeParms, $location, $firebaseObject, $firebaseArray) {
	var db = firebase.database().ref();
	var postsRef = db.child('posts');
	
	$scope.create = function() {
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
		var posts = $firebaseArray(postsRef);
		$scope.posts = posts;
	}
	
	$scope.show = function() {
		var postRef = postsRef.child($routeParms.id);
		var postObj = $firebaseObject(postRef);
		postObj.$loaded().then(function() {
			var authorRef = db.child('publishers').child(postObj.pid);
			var authorObj = $firebaseObject(authorRef);
			$scope.owner = authorObj.id == $rootScope.currentUser.id
			$scope.author = authorObj;
		});
		$scope.post = postObj;
	}
	
	$scope.delete = function(key) {
		postsRef.child(key).remove();
		$location.path('/');
	}
	
}]);