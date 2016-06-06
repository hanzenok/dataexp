angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http, $mdToast, ChartsService) {

		$scope.droppedCharts = [];

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

			//create chart object
			var chart = {};
			chart.id = 'chart_' + Math.floor(Math.random()*2000); //random
			chart.type = data.chart;
			chart.key1 = filtered_fields[0].field.name;
			chart.key2 = (filtered_fields[1]) ? filtered_fields[1].field.name : null;
			chart.ts_key = (data.chart === 'Graph' || data.chart === 'Scatter') ? 'time' : null;

			//add to the charts list
			$scope.droppedCharts.push(chart);

			//wait for the DOM elements
			//to be added
			setTimeout(function() {

				$scope.reload();
			}, 100);


		}

		$scope.reload = function(){

			console.log('reload!!! ' + $scope.droppedCharts.length);

			//load the data
			ChartsService.load($rootScope.dataset);

			//draw all the charts
			$scope.droppedCharts.forEach(function(chart, index){

				console.log('chart:');
				console.log(chart);
				ChartsService.traceOne(chart.type, '#' + chart.id, chart.key1, chart.key2, chart.ts_key);
			});

			//rendering
			dc.renderAll();
			dc.redrawAll();
		}

	});