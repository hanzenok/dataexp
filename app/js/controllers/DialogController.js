angular.module('MainApp')
	.controller('DialogController', function($scope, $rootScope, $mdDialog, SourcesService){

		/*******AddSource.html********/
		$scope.showHints = false;

		if (!$scope.source_conf){

			$scope.source_conf = {
				type: 'mongo',
				server: 'localhost',
				port: null,
				db:'',
				wanted: false
			};
		}

		$scope.connect = function() {
			
			$scope.showHints = true;
			
			console.log('DialogController:');
			console.log($scope.source_conf);

			//if all the inputs are specified
			if ($scope.source_conf.type && $scope.source_conf.server && $scope.source_conf.db){

				SourcesService.getRes().post($scope.source_conf, 
					function(result){

						if (result.length){
							console.log('here');
							$scope.source_conf.wanted = true;
							$rootScope.loadStores();
							$mdDialog.hide();
						}
						else{
							console.log('here1');
							$scope.source_conf.wanted = true;
							$rootScope.loadStores();
							$mdDialog.hide();
						}
					},
					function(err){
						console.log('error:');
						console.log(err);
					}
				);
			}
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