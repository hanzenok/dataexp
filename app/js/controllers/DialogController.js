angular.module('MainApp')
.controller('DialogController', function($scope, $mdDialog){

	$scope.yo = "Y";

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
});