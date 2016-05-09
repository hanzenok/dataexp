angular.module('MainApp')
	.controller('SourcesListController', function($scope, $mdDialog, sources){

		sources.promise.then(function(res){

			$scope.sources = res.data;
		});

		$scope.showDialog = function(event){

			$mdDialog.show({
				templateUrl: '../../templates/AddSource.html',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true
			});
		};
	});