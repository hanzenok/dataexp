angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http, $mdToast) {


		/*********On dropping chart*******/
		$scope.onDropChart = function(data){

			var filtered_fields = [];

			//filtering all the dropped fields
			//by chart type
			var fields = $rootScope.chartFields;
			var n = fields.length;
			for (var i=0; i<n; i++){

				if (fields[i].chart === data.chart){
					
					filtered_fields.push(fields[i]);
				}
			}

			//check quantity of fields
			if (filtered_fields.length !== 2) {

				$mdToast.show(
					$mdToast.simple()
						.textContent('For PieChart 2 fields should be specified')
						.action('OK')
						.position('bottom')
						.hideDelay(4000)
				);

				return;				
			}

			console.log('chart type:');
			console.log(data.chart);
			console.log('filtered_fields:');
			console.log(filtered_fields);
			console.log('dataset:');
			console.log($rootScope.dataset);

		}

	});