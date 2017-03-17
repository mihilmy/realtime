app.factory('$authService', 
		['$rootScope', '$location','$firebaseAuth', function($rootScope, $location,$firebaseAuth){
			var db = firebase.database().ref();
			var auth = $firebaseAuth();
			
			return {
				login: function(user) {
					auth.$signInWithEmailAndPassword(user.email,user.password).
					then(function(user) {
						$location.path('/success');
					}).catch(function(error) {
						$rootScope.message = error.message;
					});
				},
				registerReader: function(user) {
					auth.$createUserWithEmailAndPassword(user.email, user.password).then(function(regReader){
						var readerRef = db.child('readers').child(regReader.uid).set({
							firstName: user.firstName,
							lastName: user.lastName,
							address: user.address,
							cellPhone: user.cellPhone,
							email: user.email,
							createdAt: firebase.database.ServerValue.TIMESTAMP
						});
					}).catch(function(error){
						$rootScope.message = error.message;
					});
				},
				registerPublisher: function(user) {
					auth.$createUserWithEmailAndPassword(user.email, user.password).then(function(regPub){
						var publisherRef = db.child('publishers').child(regPub.uid).set({
							firstName: user.firstName,
							lastName: user.lastName,
							address: user.address,
							cellPhone: user.cellPhone,
							email: user.email,
							verified: false,
							createdAt: firebase.database.ServerValue.TIMESTAMP
						});
					}).catch(function(error){
						$rootScope.message = error.message;
					});
				}
			}
	
}]);