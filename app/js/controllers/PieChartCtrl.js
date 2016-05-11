angular.module('MainApp')
	.controller('PieChartCtrl', function ($scope, $rootScope) {

		$rootScope.droppedFields = [];

		$scope.onDropComplete=function(data){
		
			console.log('PieChart: onDropComplete:');
			console.log(data);

			var index = $rootScope.droppedFields.indexOf(data);
			if (index == -1){

				data.chart = "PieChart";
				$rootScope.droppedFields.push(data);
			}
		}
	});