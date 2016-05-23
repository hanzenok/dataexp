angular.module('MainApp')
	.controller('ToolbarCtrl', function($scope, $mdSidenav){

		var showAll = true;

		$scope.toggle = function(){
			console.log('here');
			$mdSidenav('left').toggle()
				.then(function(){
					console.log('good');
				})
				.catch(function(){
					console.log('bad');
				});
		}
	})