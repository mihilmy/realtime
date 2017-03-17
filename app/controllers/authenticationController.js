app.factory('$authService', 
		['$rootScope', '$firebaseAuth', function($rootScope, $firebaseAuth){
			var db = firebase.database().ref();
			var auth = $firebaseAuth();
			
			return {
				login: function(user) {
					$rootScope.message = "Hey!"
				},
				registerPublisher: function(user) {
					auth.$createUserWithEmailAndPassword(user.email, user.password).then(function(regPub){
						console.log({
							firstName: user.firstName,
							lastName: user.lastName,
							address: user.address,
							cellPhone: user.cellPhone,
							email: user.email,
							createdAt: firebase.database.ServerValue.TIMESTAMP,
						});
						var publisherRef = db.child('publishers').child(regPub.uid).set({
							firstName: user.firstName,
							lastName: user.lastName,
							address: user.address,
							cellPhone: user.cellPhone,
							email: user.email,
							createdAt: firebase.database.ServerValue.TIMESTAMP,
						});
					}).catch(function(error){
						$rootScope.message = error.message;
					})
				}
			}
	
}]);