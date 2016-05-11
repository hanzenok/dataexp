angular.module('MainApp')
	.controller('DropChartCtrl', function($scope, $rootScope){

		$scope.onDropChart = function(data,evt){

			console.log('onDropChart:');
			console.log(data);
			console.log($rootScope.droppedFields);

			$rootScope.droppedFields = [];
		}
	});