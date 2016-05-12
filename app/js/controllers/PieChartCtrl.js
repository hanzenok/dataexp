angular.module('MainApp')
	.controller('PieChartCtrl', function ($scope, $rootScope) {

		var CHART_TYPE = 'PieChart';
		$rootScope.droppedFields = [];

		$scope.onDropComplete = function(data){

			console.log($scope.pie_input);

			var index = $rootScope.droppedFields.indexOf(data);
			if (index == -1){

				data.chart = CHART_TYPE;
				$rootScope.droppedFields.push(data);
			}
		}
	});