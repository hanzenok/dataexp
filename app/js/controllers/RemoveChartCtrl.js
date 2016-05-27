angular.module('MainApp')
	.controller('RemoveChartCtrl', function($scope, $rootScope){

		$scope.onDropRemove = function(data){

			console.log('delete:');
			console.log(data);

			//if it is a field
			if (data.store && data.source){

				//timestamp field
				if (data.field.format){

					//delete timestamp field
					var index = $rootScope.droppedTSFields.indexOf(data);
					if (index > -1){

						$rootScope.droppedTSFields.splice(index, 1);
					}

				}
				else{
					
					var index = $rootScope.droppedFields.indexOf(data);
					if (index > -1){

						$rootScope.droppedFields.splice(index, 1);
					}
				}

				//if the loaded field deleted, delete all dataset
				if($rootScope.dataset){
					delete $rootScope.dataset;
					$rootScope.dataset = undefined;
				}

				//mark all other fields as ready (=not loaded)
				$rootScope.droppedTSFields.forEach(function(field_conf, index){field_conf.field.status='ready';});
				$rootScope.droppedFields.forEach(function(field_conf, index){field_conf.field.status='ready';});
			}
			//chart
			else{
				
				//delete the fields
				$rootScope.chartFields = [];
			}

			
		}
	});