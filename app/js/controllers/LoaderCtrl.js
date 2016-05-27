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

				//used to pass data to the 
				//DialogController
				var shareFieldCtrl = function ($scope, data) {

					$scope.data = data;
				}

				//ask the format of the timestamp field
				$mdDialog.show({
					templateUrl: '../../templates/SaveFormat.html',
					parent: angular.element(document.body),
					clickOutsideToClose: false,
					controller: shareFieldCtrl,
					locals: {data: data}
				})
				.then(function(format){

					data.field.format = format;
					console.log('data:');
					console.log(data);
				});

				$rootScope.droppedTSFields.push(data);
			}	
		};

		//load one merged dataset
		//$rootScope.testWatch = 1;
		$scope.load = function(){

			if ($rootScope.droppedTSFields.length && $rootScope.droppedFields.length){

				//show the progressbar
				$rootScope.showPB(true);

				//compose all the config and all the fields that needs to be downloaded into one
				var all_fields_conf = [
										$rootScope.getConfig(),
										$rootScope.droppedTSFields, 
										$rootScope.droppedFields
									];
				console.log(all_fields_conf);

				//send them to the server
				TimeseriesService.post(all_fields_conf, 
					function(data){

						console.log('data:');
						console.log(data);

						//mark all the fields as loaded
						// all_fields_conf.forEach(function(fields_per_source, index){
						
						//time stamp fields
						all_fields_conf[1].forEach(function(tsfield_conf, index){
							tsfield_conf.field.status = 'loaded';
						});

						//other fields
						all_fields_conf[2].forEach(function(field_conf, index){
							field_conf.field.status = 'loaded';
						});
						// });

						//save data
						$rootScope.dataset = data;
						console.log('dataset:');
						console.log(data);

						//loading timeseries finished
						//show the progressbar
						$rootScope.showPB(false);

						//load the stats
						TimeseriesService.stats(function(stats){

							var config = stats[0];
							console.log('stats:');
							console.log(config);
							
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