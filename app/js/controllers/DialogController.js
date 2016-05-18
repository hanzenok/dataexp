angular.module('MainApp')
	.controller('DialogController', function($scope, $mdDialog, SourcesService){

		/*******AddSource.html********/
		$scope.showHints = false;

		if (!$scope.source_conf){

			$scope.source_conf = {
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
			console.log($scope.source_conf);
			if($scope.source_conf.type && $scope.source_conf.server && $scope.source_conf.db)
			SourcesService.getRes().post($scope.source_conf);
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