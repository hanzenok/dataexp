angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http, $mdToast, ChartsService) {

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
			// if (filtered_fields.length !== 2) {

			// 	$mdToast.show(
			// 		$mdToast.simple()
			// 			.textContent('For PieChart 2 fields should be specified')
			// 			.action('OK')
			// 			.position('bottom')
			// 			.hideDelay(4000)
			// 	);

			// 	return;				
			// }

			console.log('Chart: ' + data.chart);
			console.log('Fields:');
			console.log(filtered_fields);
			console.log('Dataset:');
			console.log($rootScope.dataset);

			// console.log('state: ' + ChartsService.load($rootScope.dataset));
			ChartsService.traceOne(data.chart, '#test', filtered_fields[0].field.name);
			dc.renderAll();

		}

	});