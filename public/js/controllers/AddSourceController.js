angular.module('MainApp')
.controller('AddSourceController', function($scope, $mdDialog){


	$scope.showAlert = function(event){

		$mdDialog.show(

			$mdDialog.alert()
				.parent(angular.element(document.querySelector('#content')))
				.clickOutsideToClose(true)
				.title('Alert')
				.textContent('Alert')
				.ariaLabel('Alert')
				.ok('OK!')
				.targetEvent(event)
		);
	};

	$scope.showAdvanced = function(ev) {

		console.log('Yo');

		$mdDialog.show({
			controller: DialogController,
			templateUrl: '../../templates/AddSource.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
		});
  };
});

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}