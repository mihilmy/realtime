app.controller('loginController',
	 ['$scope','$authService', 
		function($scope, $authService) {
			
			$scope.login = function() {
				$authService.login($scope.user);
			}
}]);