angular.module('MainApp')
	.controller('SourcesListController', function($scope, $mdDialog, sources){

		//sources list
		$scope.sources = sources.data;

		//dialog to modify the source
		$scope.showDialog = function(event){

			$mdDialog.show({
				templateUrl: '../../templates/AddSource.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true
			});
		};
	});