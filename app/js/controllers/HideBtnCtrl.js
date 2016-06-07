angular.module('MainApp')
	.controller('HideBtnCtrl', function ($scope, $rootScope) {

	$rootScope.hideFooter = false;
	$scope.test = function(){

		console.log('Tessst');

		$rootScope.hideFooter = !$rootScope.hideFooter;
		}
});