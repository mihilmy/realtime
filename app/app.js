var app = angular.module("realtime", ['ngRoute','firebase']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/login', {
		templateUrl: 'views/login.html',
		controller: 'registrationController'
	}).
	when('/register', {
		templateUrl: 'views/register.html',
		controller: 'registrationController'
	}).
	when('/success', {
		templateUrl: 'views/success.html',
		controller: 'successController'
	}).
	otherwise({
		redirectTo: '/login'
	})
}]);