angular.module('MainApp')
	.controller('PieChartCtrl', function ($scope, $rootScope) {

		var CHART_TYPE = 'PieChart';
		$rootScope.droppedFields = [];
		$scope.pie_input = 'ISO'; //a placeholder for the input

		$scope.onDropComplete = function(data){

			var index = $rootScope.droppedFields.indexOf(data);
			if (index == -1){

				data.chart = CHART_TYPE;
				$rootScope.droppedFields.push(data);
			}
		}
	});