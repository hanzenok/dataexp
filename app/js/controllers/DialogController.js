angular.module('MainApp')
	.controller('DialogController', function($scope, $mdDialog, SourcesService){

		/*******AddSource.html********/
		$scope.showHints = false;

		if (!$scope.source){

			$scope.source = {
				name: '',
				type: 'mongo',
				server: 'localhost',
				port: '',
				db:'',
				wanted: false
			};
		}

		$scope.connect = function() {
			
			$scope.showHints = true;
			
			console.log('DialogController:');
			console.log($scope.source);
			if($scope.source.name && $scope.source.type && $scope.source.server && $scope.source.db)
			SourcesService.getRes().post($scope.source);
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