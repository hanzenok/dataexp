angular.module('MainApp')
	.controller('HideBtnCtrl', function ($scope, $rootScope) {

	$rootScope.hideFooter = false;
	$scope.toogle = function(){

		$rootScope.hideFooter = !$rootScope.hideFooter;
	}
});