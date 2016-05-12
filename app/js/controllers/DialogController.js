angular.module('MainApp')
	.controller('DialogController', function($scope, $mdDialog){

		//AddSource.html
		$scope.connect = function() {
			console.log('Connnect');
		};

		//SaveFormat.html
		$scope.format = 'ISO';
		$scope.saveFormat = function(){
			
			$mdDialog.hide($scope.format);
		};

		//both
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
	});