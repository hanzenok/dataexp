angular.module('MainApp')
	.controller('HideBtnCtrl', function ($scope, $rootScope) {

	$rootScope.hideFooter = false;
	$scope.image = 'images/down.svg';
	$scope.toogle = function(){

		//toogle the footer
		$rootScope.hideFooter = !$rootScope.hideFooter;

		//toogle the image
		$scope.image = ($rootScope.hideFooter) ? 'images/up.svg' : 'images/down.svg';
	}
	
});