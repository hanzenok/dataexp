angular.module('MainApp')
	.controller('PieChartCtrl', function ($scope, $rootScope) {

		var CHART_TYPE = 'PieChart';
		$scope.pie_input = 'ISO'; //a placeholder for the input

		$scope.onDropComplete = function(data){


			if(data.field.status === 'loaded' && !data.field.format){

				var index = $rootScope.chartFields.indexOf(data);
				if (index == -1){

					data.chart = CHART_TYPE;
					$rootScope.chartFields.push(data);
				}
			}
		}
	});