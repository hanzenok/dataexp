angular.module('MainApp')
	.controller('FabCtrl', function($scope, $mdDialog){

		$scope.showDialog = function(ev) {

			$mdDialog.show({
				templateUrl: '../../templates/AddSource.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
			});
	  	};
	});