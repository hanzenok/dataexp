angular.module('MainApp')
	.controller('PieChartCtrl', function ($scope, $rootScope) {

		var CHART_TYPE = 'Pie';

		$scope.onDropComplete = function(data){


			if(data.field && data.field.status === 'loaded' && !data.field.format){

				var index = $rootScope.chartFields.indexOf(data);
				if (index == -1){

					data.chart = CHART_TYPE;
					$rootScope.chartFields.push(data);
				}
			}
		}
	});