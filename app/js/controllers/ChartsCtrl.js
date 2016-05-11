angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http) {


		//chart is a type of the chart
		$scope.onDropChart=function(data){
		
			var filtered_fields = [];
			var fields = $rootScope.droppedFields;

			//filtering all the dropped fields
			var n = fields.length;
			for (var i=0; i<n; i++){

				if (fields[i].chart === data.chart){
					
					filtered_fields.push(fields[i]);
				}
			}


			//sending all the infor to the server
			//and waiting for the merged dataset
			$http.post("/api/dataset", filtered_fields).success(function(data, status) {
				
				console.log('sent:');
				console.log(filtered_fields);
				//$scope.fields = data;

			}).error(function(err, status){

				throw new Error(err);
			});
		}
	});