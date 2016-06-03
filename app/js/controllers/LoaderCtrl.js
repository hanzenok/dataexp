angular.module('MainApp')
	.controller('LoaderCtrl', function($scope, $rootScope, $mdDialog, $mdToast, TimeseriesService, ChartsService){

		//containers
		$rootScope.droppedFields = [];//fields that are dropped to the loader
		$rootScope.droppedTSFields = []; //timestamp fields that are dropped to the loader
		$rootScope.chartFields = []; //loaded fields that are dropped to any chart
		$rootScope.dataset = [];
		$rootScope.loaded = false;

		//a field dropped
		$scope.onDropComplete = function(data){

			var index = $rootScope.droppedFields.indexOf(data);
			if (index == -1){

				$rootScope.droppedFields.push(data);
			}		
		};

		//a primary field dropped
		$scope.onTSDropComplete = function(data){

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
		};

		//load one merged dataset
		$scope.load = function(){

			if ($rootScope.droppedTSFields.length && $rootScope.droppedFields.length){

				//show the progressbar
				$rootScope.showPB(true);

				//compose all the config and all the fields that needs to be downloaded into one
				var all_fields_conf = [
										$rootScope.getOptions(),
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
							config = JSON.stringify(ts_config[0], null, 4);
							var blob = new Blob([config], {type : 'text/plain'});
							$scope.url = (window.URL || window.webkitURL).createObjectURL(blob);

							$rootScope.loaded = true;
							console.log('loaded');

							//initialise the charts
							ChartsService.load($rootScope.dataset);
							dc.renderAll();

						});

					},
					function(err){

						$rootScope.showPB(false);

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