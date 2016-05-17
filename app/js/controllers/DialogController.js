angular.module('MainApp')
	.controller('DialogController', function($scope, $mdDialog){

		/*******AddSource.html********/
		$scope.type = 'mongo';
		$scope.connect = function() {
			console.log('Connnect ' + $scope.name + ' ' + $scope.type + ' ' + $scope.server + ' ' + $scope.port + ' ' + $scope.db);
		};

		/*******SaveFormat.html********/
		$scope.format = 'ISO';
		$scope.saveFormat = function(){
			
			$mdDialog.hide($scope.format);
		};

		/***********Both***********/
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
	});