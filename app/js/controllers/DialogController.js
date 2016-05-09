angular.module('MainApp')
	.controller('DialogController', function($scope, $mdDialog){

		$scope.cancel = function() {
			$mdDialog.cancel();
		};
	});