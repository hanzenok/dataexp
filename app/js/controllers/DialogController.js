angular.module('MainApp')
	.controller('DialogController', function($scope, $rootScope, $mdDialog, $mdToast, SourcesService, $resource){

		/*******AddSource.html********/
		$scope.showHints = false; //managin the error hints
		$scope.deletable = true; //wheather to activate the delete button on the AddSource.html

		if (!$scope.source_conf){

			$scope.source_conf = {
				name: '',
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

			if (!$scope.deletable && $scope.source_conf.name && $scope.source_conf.type && 
				$scope.source_conf.server && $scope.source_conf.db){

				SourcesService.post($scope.source_conf, 
					function(result){

						console.log('SourcesService');
						console.log('here');
						console.log($scope.source_conf);
						$rootScope.loadSources();
						$mdDialog.hide();

					},
					function(err){

						$mdDialog.hide();

						$mdToast.show(
							$mdToast.simple()
								.textContent(err.data)
								.action('OK')
								.position('bottom')
								.hideDelay(4000)
						);
					}
				);
			}
			else{
				console.log('here1');
				$scope.source_conf.wanted = true;
				$rootScope.loadStores();
				$mdDialog.hide();
			}
		};

		$scope.deleteSource = function(){

			console.log('delete!!');
			console.log($scope.source_conf);
			SourcesService.delete($scope.source_conf.name, 
				function(){
					
					$rootScope.loadSources();
					$rootScope.loadStores();
					$mdDialog.hide();
				},
				function(err){

					$mdDialog.hide();

					$mdToast.show(
						$mdToast.simple()
							.textContent(err.data)
							.action('OK')
							.position('bottom')
							.hideDelay(4000)
					);
				}
			);
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