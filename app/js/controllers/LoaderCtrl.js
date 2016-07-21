angular.module('MainApp')
	.controller('LoaderCtrl', function($scope, $rootScope, $mdDialog, $mdToast, TimeseriesService, DCChartsService, CanvasChartsService){

		//containers
		$rootScope.droppedFields = [];//fields that are dropped to the loader
		$rootScope.droppedTSFields = []; //timestamp fields that are dropped to the loader
		$rootScope.chartFields = []; //loaded fields that are dropped to any chart
		$rootScope.dataset = [];
		$rootScope.loaded = false;

		//a field dropped
		$scope.onDropComplete = function(data){

			//if dropped object is a field
			if (data.field){

				//find if exists
				var index = $rootScope.droppedFields.indexOf(data);

				//if not exists
				if (index == -1){

					//add the quantification field
					data.field.quantum = 0;

					//add
					$rootScope.droppedFields.push(data);
				}
			}		
		};

		//a primary field dropped
		$scope.onTSDropComplete = function(data){

			//if dropped object is a field
			if (data.field){

				//copy the object
				var clone = JSON.parse(JSON.stringify(data));

				//check the index
				var index = -1;
				var n = $rootScope.droppedTSFields.length;
				for (var i=0; i<n; i++){

					if (clone.field.name === $rootScope.droppedTSFields[i].field.name && 
						clone.store.name === $rootScope.droppedTSFields[i].store.name &&
						clone.source.name === $rootScope.droppedTSFields[i].source.name){

						index = i;
						break
					}
				}
				
				//if not exists
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
						locals: {data: clone}
					})
					.then(function(format){

						//set the format
						clone.field.format = format;
					});
				
					//add asynchroniously
					$rootScope.droppedTSFields.push(clone);

				}
			}	
		};

		//load one merged dataset
		$scope.load = function(){

			var timestamps = $rootScope.droppedTSFields;
			var fields = $rootScope.droppedFields;

			if (timestamps.length && fields.length){

				//show the progressbar
				$rootScope.showPB(true);

				//get the options
				var options = $rootScope.getOptions();

				//mark all the quantum of all the timestamps
				timestamps.forEach(function(ts_config, index){

					ts_config.field.quantum = options.tsfield_quantum;
				});

				//compose all the options and all the fields that needs to be downloaded into one
				var all_fields_conf = [
										options,
										timestamps, 
										fields
									];
				console.log(all_fields_conf);

				//send them to the server
				TimeseriesService.post(all_fields_conf, 
					function(data){

						//hide the progressbar
						$rootScope.showPB(false);

						//data has at least two elements
						//(one is promise related)
						if (data && data.length > 2){
	
							console.log('data:');
							console.log(data);

							//save data
							$rootScope.dataset = data;
							console.log('dataset:');
							console.log(data);

							//load the stats
							TimeseriesService.stats(function(stats){

								var stat = stats[0];
								console.log('stats:');
								console.log(stat);
								
								$rootScope.setStats(stat);
							});

							//load the config
							TimeseriesService.config(function(ts_config){

								//delete unnecessary frontend fields:
								ts_config[0].timeseries.forEach(function(ts, index){

									//delete timestamp fields
									delete ts.timestamp.short;
									delete ts.timestamp.status;
									delete ts.timestamp.value;

									//delete other fields
									ts.fields.forEach(function(field, index){

										delete field.short;
										delete field.status;
										delete field.value;
									});
								});

								//let the config to be downloadable
								var config = JSON.stringify(ts_config[0], null, 4);
								var blob = new Blob([config], {type: 'text/json'});
								$scope.url = (window.URL || window.webkitURL).createObjectURL(blob);

								//NOT CONFIG RELATED STUFF BUT
								//SHOULD BE LAUNCHED SYNCHRONIOUSLY

								//let the dataset to be downloadable
								var dataset = JSON.stringify($rootScope.dataset, null, 4);
								var blob2 = new Blob([dataset], {type: 'text/json'});
								$rootScope.url = (window.URL || window.webkitURL).createObjectURL(blob2);

								//load data into the charting library
	
								var chart_service = ($rootScope.size_status === 'overflow' || $rootScope.force_canvasjs) ? CanvasChartsService : DCChartsService;
								chart_service.load($rootScope.dataset, function(err){

									if (err){
										$mdToast.show(
											$mdToast.simple()
												.textContent(err.message)
												.action('OK')
												.position('bottom')
												.hideDelay(4000)
										);
									}
								});

								//if there are some charts, reload them
								if ($rootScope.droppedCharts.length){

									$rootScope.reloadCharts();
								}

								//mark as loaded
								$rootScope.loaded = true;

								//mark all the fields as loaded					
								//time stamp fields
								all_fields_conf[1].forEach(function(tsfield_conf, index){
									tsfield_conf.field.status = 'loaded';
								});

								//other fields
								all_fields_conf[2].forEach(function(field_conf, index){
									field_conf.field.status = 'loaded';
								});

							});

						}

					},
					function(err){

						$rootScope.showPB(false);
						if (!err.data) err.data = 'Server is unreachable';
						
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

		//delte fields from the loader
		// $scope.clear = function(){

		// 	$rootScope.droppedFields = [];
		// 	$rootScope.droppedTSFields = [];
		// }
	});