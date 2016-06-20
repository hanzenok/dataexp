angular.module('MainApp')
	.controller('DeleteZoneCtrl', function($scope, $rootScope){

		$scope.onDropRemove = function(data){

			console.log('delete:');
			console.log(data);

			//if it is a field
			if (data.field && data.store && data.source){

				//timestamp field
				if (data.field.format !== undefined){

					//delete timestamp field
					var index = $rootScope.droppedTSFields.indexOf(data);
					if (index > -1){

						$rootScope.droppedTSFields.splice(index, 1);
					}
					console.log($rootScope.droppedTSFields);

				}
				else{
					
					var index = $rootScope.droppedFields.indexOf(data);
					if (index > -1){

						$rootScope.droppedFields.splice(index, 1);
					}
				}

				//clear the dataset
				if ($rootScope.dataset !== undefined && data.field.status === 'loaded' && $rootScope.loaded){

					//delete the dataset
					delete $rootScope.dataset;
					$rootScope.dataset = [];

					//mark all fields as ready (=not loaded)
					data.field.status = 'ready';
					$rootScope.droppedTSFields.forEach(function(field_conf, index){field_conf.field.status = 'ready';});
					$rootScope.droppedFields.forEach(function(field_conf, index){field_conf.field.status = 'ready';});

					//mark the dataset as not loaded
					$rootScope.loaded = false;

					//clear stats&options
					$rootScope.setStats(null);
				}
			}
			//DC charts
			else{
				
				if (data.id !== undefined){

					var index = $rootScope.droppedCharts.indexOf(data);
					if (index > -1){

						$rootScope.droppedCharts.splice(index, 1);
					}
				}
				//movable charts
				else{

					console.log('delete chart:');
					console.log(data);

					for (var i=0; i<$rootScope.chartFields.length; i++){

						if ($rootScope.chartFields[i].chart === data.chart){

							$rootScope.chartFields.splice(i, 1);
							i--;
						}
					}
				}
			}
		}


		//delete all the dropped items:
		//DC charts, movable charts, timestamp fields
		//and normal fields
		$scope.clearAll = function(){

			//delete dataset
			delete $rootScope.dataset;
			$rootScope.dataset = [];

			//dropped fields on the loader were not clonned
			$rootScope.droppedFields.forEach(function(field_conf, index){field_conf.field.status = 'ready';});

			//clear all the droppable objects
			$rootScope.droppedCharts = []; //DC charts
			$rootScope.chartFields = []; //movable charts
			$rootScope.droppedTSFields = []; //timestamp fields
			$rootScope.droppedFields = []; //fields

			//clear stats&options
			$rootScope.setStats(null);
		}
	});