angular.module('MainApp', ['ngMaterial'])
.controller('SidebarController', function($scope, $mdDialog){

	$scope.sources = [
		{ name: 'Mongo', wanted: true },
		{ name: 'SQL', wanted: true },
		{ name: 'File', wanted: false }
	];

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