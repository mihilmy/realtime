app.controller('registrationController',
	 ['$scope','$authService', 
		function($scope, $authService) {
			
			$scope.register = function(){
				//Check if he was a publisher or reader.
				$authService.registerPublisher($scope.user);
			}

}]);