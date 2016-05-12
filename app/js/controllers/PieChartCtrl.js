angular.module('MainApp')
	.controller('PieChartCtrl', function ($scope, $rootScope) {

		var CHART_TYPE = 'PieChart';
		$rootScope.droppedFields = [];

		$scope.isDraggable = function(){

			console.log('isFormatDefined');
			console.log($scope.pie_input);
			console.log(countDroppedFields.call(this, $rootScope.droppedFields, CHART_TYPE));

			if ($scope.pie_input) return true;

			return false;
		}

		$scope.onDropComplete = function(data){

			console.log($scope.pie_input);

			var index = $rootScope.droppedFields.indexOf(data);
			if (index == -1){

				data.chart = CHART_TYPE;
				$rootScope.droppedFields.push(data);
			}
		}
	});

function countDroppedFields(droppedFields, chart_type){

	var count = 0;
	var n = droppedFields.length;

	if(n && chart_type){

		for (var i=0; i<n; i++){

			if(droppedFields[i].chart === chart_type)
				count++;
		}
	}

	return count;

}