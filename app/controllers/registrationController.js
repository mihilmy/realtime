app.controller('registrationController',
	 ['$scope','$authService', 
		function($scope, $authService) {
			
			$scope.register = function(){
				//Depending on the type of account, we delegate to the relevant register function.
				if($scope.user.type == "publisher") {
					$authService.registerPublisher($scope.user);
				} else {
					$authService.registerReader($scope.user);
				}
				
			}

}]);