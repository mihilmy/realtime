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
	when('/new', {
		templateUrl: 'views/posts/new.html',
		controller: 'postsController'
	}).
	when('/users/:id', {
		templateUrl: 'views/users/show.html',
		controller: 'usersController'
	}).
	when('/posts/:id', {
		templateUrl: 'views/posts/show.html',
		controller: 'postsController'
	}).
	when('/login', {
		templateUrl: 'views/login.html',
		controller: 'loginController'
	}).
	when('/register', {
		templateUrl: 'views/register.html',
		controller: 'registrationController'
	}).
	when('/', {
		templateUrl: 'views/posts/index.html',
		controller: 'postsController',
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