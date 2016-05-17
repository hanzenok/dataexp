angular.module('MainApp')
	.controller('DialogController', function($scope, $mdDialog){

		/*******AddSource.html********/
		$scope.showHints = false;
		$scope.source = {

			name: '',
			type: 'mongo',
			server: 'localhost',
			port: '',
			db:'',
			wanted: true
		};
		$scope.type = 'mongo';
		$scope.connect = function() {
			
			$scope.showHints = true;
			console.log($scope.source);
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