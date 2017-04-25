app.factory('$authService', 
		['$rootScope', '$location','$firebaseAuth','$firebaseObject', 
		 function($rootScope, $location,$firebaseAuth, $firebaseObject){
			var db = firebase.database().ref();
			var auth = $firebaseAuth();
			var funcs;
			//On the authorization state changes
			auth.$onAuthStateChanged(function(user) {
				if(user && user.emailVerified) {
					var userRef = db.child('users').child(user.uid);
					var userObj = $firebaseObject(userRef);
					userObj.$loaded().then(function() {
						if(userObj.type == "reader"){
							$rootScope.restricted = true;
						} else {
							$rootScope.restricted = false;
						}
						$rootScope.currentUser = userObj;
					});
					
					
				} else if(user && !user.emailVerified) {
					$rootScope.message = "You must verify your email address. Please check your inbox, we're waiting for you.";
				} else {
					$rootScope.currentUser = null;
					$rootScope.restricted = null;
				}
			});
			
			funcs = {
				login: function(user) {
					auth.$signInWithEmailAndPassword(user.email,user.password).
					then(function(regUser) {
						if(regUser.emailVerified) {
							$location.path('/');	
						} else {
							$location.path('/login');	
						}
						
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
						var readerRef = db.child('users').child(regReader.uid).set({
							firstName: user.firstName,
							lastName: user.lastName,
							address: user.address.formatted_address,
							cellPhone: user.cellPhone,
							email: user.email,
							subsription: false,
							type: "reader",
							id: regReader.uid,
							createdAt: firebase.database.ServerValue.TIMESTAMP
						}).then(function() {
							regReader.sendEmailVerification().then(function() {
								funcs.login(user);
							});
						}).catch(function(error) {
							$rootScope.message = error.message;
						});

					}).catch(function(error){
						$rootScope.message = error.message;
					});
					
				},
				
				registerPublisher: function(user) {
					auth.$createUserWithEmailAndPassword(user.email, user.password).then(function(regPub){
						var publisherRef = db.child('users').child(regPub.uid).set({
							firstName: user.firstName,
							lastName: user.lastName,
							address: user.address.formatted_address,
							cellPhone: user.cellPhone,
							email: user.email,
							subsription: false,
							type: "publisher",
							id: regPub.uid,
							createdAt: firebase.database.ServerValue.TIMESTAMP
						}).then(function() {
							regPub.sendEmailVerification().then(function() {
								funcs.login(user);
							});
						})
						.catch(function(error) {
							$rootScope.message = error.message;
						});
						
						
					}).catch(function(error){
						$rootScope.message = error.message;
					});
				}
			}
			
			return funcs;
	
}]);