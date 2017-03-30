app.controller('usersController', ['$scope', '$routeParams', '$firebaseArray', '$firebaseObject', function($scope, $routeParams, $firebaseArray, $firebaseObject){
	var db = firebase.database().ref();
	
	$scope.posts = function() {
		var postsRef = db.child('posts');
		var postsArray = $firebaseArray(postsRef);
		var posts = [];
		postsArray.$loaded().then(function() {
			for(i = 0; i < postsArray.length; i++) {
				if(postsArray[i].pid == $routeParams.id) {
					posts.push(postsArray[i]);
				}
			}
		});
		$scope.publishedPosts = posts;
	}
	
	$scope.show = function() {
		var pubRef = db.child('publishers').child($routeParams.id);
		$scope.author = $firebaseObject(pubRef);
	}
}]);