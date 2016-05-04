angular.module('MainApp')
	.controller('SourcesListController', function($scope, $mdDialog, sources){

		$scope.sources = sources;

		$scope.showAlert = function(event){

			$mdDialog.show( 

				$mdDialog.alert()
					.parent(angular.element(document.querySelector('#content')))
					.clickOutsideToClose(true)
					.title('Alert title')
					.textContent('Alert text')
					.ariaLabel('Alert Dialog')
					.ok('OK!')
					.targetEvent(event)
			);
		};
	});