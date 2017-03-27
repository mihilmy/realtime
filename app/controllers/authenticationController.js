app.factory('$authService', 
		['$rootScope', '$location','$firebaseAuth','$firebaseObject', 
		 function($rootScope, $location,$firebaseAuth, $firebaseObject){
			var db = firebase.database().ref();
			var auth = $firebaseAuth();
			var funcs;
			//On the authorization state changes
			auth.$onAuthStateChanged(function(user) {
				if(user) {
					var userRef = db.child('publishers').child(user.uid);
					var userObj = $firebaseObject(userRef);
					$rootScope.currentUser = userObj;
				} else {
					$rootScope.currentUser = null;
				}
			});
			
			funcs = {
				login: function(user) {
					auth.$signInWithEmailAndPassword(user.email,user.password).
					then(function(user) {
						$location.path('/');
					}).catch(function(error) {
						$rootScope.message = error.message;
					});
				},
				
				logout: function() {
					return auth.$signOut();
				},
				
				requireAuth: function() {
					return auth.$requireSignIn();
				},
				
				registerReader: function(user) {
					auth.$createUserWithEmailAndPassword(user.email, user.password).then(function(regReader){
						var readerRef = db.child('readers').child(regReader.uid).set({
							firstName: user.firstName,
							lastName: user.lastName,
							address: user.address,
							cellPhone: user.cellPhone,
							email: user.email,
							id: regReader.uid,
							createdAt: firebase.database.ServerValue.TIMESTAMP
						});
						
						funcs.login(user);
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
							subsription: false,
							id: regPub.uid,
							createdAt: firebase.database.ServerValue.TIMESTAMP
						});
						funcs.login(user);
					}).catch(function(error){
						$rootScope.message = error.message;
					});
				}
			}
			
			return funcs;
	
}]);