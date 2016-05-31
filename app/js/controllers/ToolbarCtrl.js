angular.module('MainApp')
	.controller('ToolbarCtrl', function($scope, $rootScope, $mdSidenav){

		var state = true;
		$scope.toggle = function(){
			
			console.log('toogle sidenav');
		}
	})