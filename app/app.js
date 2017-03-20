var app = angular.module("realtime", ['ngRoute','firebase']);

app.run(['$rootScope', '$location', function($rootScope, $location) {
	$rootScope.$on('$routeChangeError', function(event,next,previous, error){
		if (error == 'AUTH_REQUIRED') {
			$rootScope.message = "Sorry you must be logged in";
			$location.path('/login');
		} 
	});
}]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/login', {
		templateUrl: 'views/login.html',
		controller: 'loginController'
	}).
	when('/register', {
		templateUrl: 'views/register.html',
		controller: 'registrationController'
	}).
	when('/success', {
		templateUrl: 'views/success.html',
		resolve: {
			currentAuth: function($authService){
				return $authService.requireAuth();
			}
		}
	}).
	otherwise({
		redirectTo: '/login'
	});
}]);