angular.module('MainApp')
.controller('AddSourceController', function($scope, $mdDialog){

	$scope.showDialog = function(ev) {

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

	$scope.yo = "YOO";
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