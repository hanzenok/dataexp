angular.module('MainApp')
	.controller('DialogController', function($scope, $rootScope, $mdDialog, SourcesService, $resource){

		/*******AddSource.html********/
		$scope.showHints = false; //managin the error hints
		$scope.deletable = true; //wheather to activate the delete button on the AddSource.html

		if (!$scope.source_conf){

			$scope.source_conf = {
				type: 'mongo',
				server: 'localhost',
				port: null,
				db:'',
				wanted: false
			};

			$scope.deletable = false;
		}

		$scope.connect = function() {
			
			$scope.showHints = true;
			
			console.log('DialogController:');
			console.log($scope.source_conf);

			//if all the inputs are specified
			if ($scope.source_conf.type && $scope.source_conf.server && $scope.source_conf.db){

				SourcesService.getRes().post($scope.source_conf, 
					function(result){
						console.log('SourcesService');
						if (result.length){
							console.log('here');
							console.log($scope.source_conf);
							$rootScope.loadSources();
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

		$scope.deleteSource = function(){

			console.log('delete!!');
			console.log($scope.source_conf);
			var a = $resource('/api/sources/:test_id', {test_id: 'id'});
			a.delete({test_id: $scope.source_conf});
		}

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