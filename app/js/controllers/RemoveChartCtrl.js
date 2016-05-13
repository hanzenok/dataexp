angular.module('MainApp')
	.controller('RemoveChartCtrl', function($scope, $rootScope){

		$scope.onDropRemove = function(data){

			//if it is a field
			if (data.store && data.source){

				//timestamp field
				if (data.format){

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
			}
			//chart
			else{

				
				//delete the fields
				$rootScope.chartFields = [];
			}

			
		}
	});