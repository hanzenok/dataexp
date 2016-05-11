angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope) {


		//chart is a type of the chart
		$scope.onDropChart=function(data){
		
			var filtered_fields = [];
			var fields = $rootScope.droppedFields;

			//filtering all the dropped fields
			var n = fields.length;
			for (var i=0; i<n; i++){

				console.log();
				if (fields[i].chart === data.chart){
					
					filtered_fields.push(fields[i]);
				}
			}

			console.log(filtered_fields);
		}
	});