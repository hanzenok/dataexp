angular.module('MainApp')
	.controller('DeleteZoneCtrl', function($scope, $rootScope){

		$scope.onDropRemove = function(data){

			console.log('delete:');
			console.log(data);

			//if it is a field
			if (data.field && data.store && data.source){

				//timestamp field
				if (data.field.format){

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
				}
			}
			//chart
			else{
				
				//delete the fields
				$rootScope.chartFields = [];
			}

			
		}
	});