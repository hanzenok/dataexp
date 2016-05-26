angular.module('MainApp')
	.controller('LoaderCtrl', function($scope, $rootScope, $mdDialog, $mdToast, TimeseriesService){

		//containers
		$rootScope.droppedFields = [];//fields that are dropped to the loader
		$rootScope.droppedTSFields = []; //timestamp fields that are dropped to the loader
		$rootScope.chartFields = []; //loaded fields that are dropped to any chart

		//a field dropped
		$scope.onDropComplete = function(data){

			var index = $rootScope.droppedFields.indexOf(data);
			if (index == -1){

				$rootScope.droppedFields.push(data);
			}		
		};

		//a primary field dropped
		$scope.onTSDropComplete = function(data){

			var index = $rootScope.droppedTSFields.indexOf(data);
			if (index == -1){

				//ask the format of the timestamp field
				$mdDialog.show({
					templateUrl: '../../templates/SaveFormat.html',
					parent: angular.element(document.body),
					clickOutsideToClose: false
				})
				.then(function(answer){

					data.format = answer;
					console.log('data:');
					console.log(data);
				});

				$rootScope.droppedTSFields.push(data);
			}	
		};

		//load one merged dataset
		//$rootScope.testWatch = 1;
		$scope.load = function(){

			//$rootScope.testWatch++;
			console.log($rootScope.getConfig());

			if ($rootScope.droppedTSFields.length && $rootScope.droppedFields.length){

				//compose all the fields that needs to be downloaded into one
				var all_fields_conf = [$rootScope.droppedTSFields, $rootScope.droppedFields];
				console.log(all_fields_conf);

				//send them to the server
				TimeseriesService.post(all_fields_conf, 
					function(data){

						//mark all the fields as loaded
						all_fields_conf.forEach(function(fields_per_source, index){
							
							fields_per_source.forEach(function(field_conf, index){
								field_conf.status = 'loaded';
							});
						});

						//save data
						$rootScope.dataset = data;
						console.log('dataset:');
						console.log(data);

						//load the stats
						TimeseriesService.stats(function(stats){

							var config = stats[0];
							config.from = new Date('1993/01/28').toString();
							config.to = new Date('2004/02/14').toString();
							
							$rootScope.setConfig(config);
						});

					},
					function(err){

						$mdToast.show(
							$mdToast.simple()
								.textContent(err.data)
								.action('OK')
								.position('bottom')
								.hideDelay(4000)
						);
					});
			}
			else{

				$mdToast.show(
					$mdToast.simple()
						.textContent('No fields are specified')
						.action('OK')
						.position('bottom')
						.hideDelay(4000)
				);
			}

		};
	});