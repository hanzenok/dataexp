angular.module('MainApp')
	.controller('PieChartCtrl', function ($scope, $rootScope) {

		var CHART_TYPE = 'PieChart';
		//$rootScope.droppedFields = []; it's in the LoaderCtrl now
		$scope.pie_input = 'ISO'; //a placeholder for the input

		$scope.onDropComplete = function(data){

			console.log(data);

			if(data.status === 'loaded' && !data.format){

				var index = $rootScope.chartFields.indexOf(data);
				if (index == -1){

					data.chart = CHART_TYPE;
					$rootScope.chartFields.push(data);
				}
			}
		}
	});