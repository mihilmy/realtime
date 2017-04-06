app.controller('usersController', ['$scope', '$rootScope', '$routeParams', '$firebaseArray', '$firebaseObject', '$route',function($scope,$rootScope, $routeParams, $firebaseArray, $firebaseObject, $route){
	var db = firebase.database().ref();
	
	$scope.publisherPosts = function() {
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
		var userRef = db.child('users').child($routeParams.id);
		$scope.user = $firebaseObject(userRef);
	}
	
	$scope.isSelf = function () {
		return $routeParams.id == $rootScope.currentUser.id;
	}
	
	$scope.subscribe = function() {
		var userRef = db.child('subscriptions').child($rootScope.currentUser.id);
		
		userRef.child($routeParams.id).transaction(function(currentData) {
			if (currentData === null) {
				console.log('Subscribe');
				return true;
			} else {
				console.log('Unsubscribe');
				return;
			}
		}, function(error, committed, snapshot) {
			if (error) {
				console.log('Transaction failed abnormally!', error);
			} else if (!committed) {
				userRef.child($routeParams.id).remove();
			} else {
				console.log('Subscription added!');
			}
		});
		
	}
	/*
	A mapper that finds the users favorites and then cross maps the keys to the actual post.
	*/
	$scope.favorites = function() {
		var favsRef = db.child('favorites').child($routeParams.id);
		var favs = $firebaseObject(favsRef);
		var postsRef = db.child('posts');
		var posts = [];
		favs.$loaded().then(function() {
			for(var key in favs) {
				if (favs.hasOwnProperty(key) && !key.startsWith("$")) {
					var p = $firebaseObject(postsRef.child(key));
					p.$loaded().then(function() {
						posts.push(p);
						$scope.favPosts = posts;
					});
					
				}
			}
		});
		
	}
	

	
}]);