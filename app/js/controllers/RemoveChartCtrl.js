angular.module('MainApp')
	.controller('RemoveChartCtrl', function($scope, $rootScope){

		$scope.onDropChart = function(data,evt){

			$rootScope.droppedFields = [];
		}
	});