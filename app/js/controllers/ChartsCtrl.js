angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http, $mdToast, $mdColorPalette, ChartsService) {

		var EnumCharts = {
							pie: 'Pie',
							graph: 'Graph',
							scatter: 'Scatter',
							row: 'Row',
							bar: 'Bar'
						};


// var chart = new CanvasJS.Chart("chartContainer",
//     {
//     data: [
//     {        
//         type: "line",
//         dataPoints: [//array
//         { x: new Date(2012, 01, 1), y: 26},
//         { x: new Date(2012, 01, 3), y: 38},
//         { x: new Date(2012, 01, 5), y: 43},
//         { x: new Date(2012, 01, 7), y: 29},
//         { x: new Date(2012, 01, 11), y: 41},
//         { x: new Date(2012, 01, 13), y: 54},
//         { x: new Date(2012, 01, 20), y: 66},
//         { x: new Date(2012, 01, 21), y: 60},
//         { x: new Date(2012, 01, 25), y: 53},
//         { x: new Date(2012, 01, 27), y: 60}

//         ]
//     }
//     ]
// });

//     chart.render();



		$rootScope.droppedCharts = [];
		$scope.onDropChart = function(data){

			//if dropped object not a DC.js chart
			if (data && data.chart && $rootScope.chartFields.length){

				console.log('onDropChart:');
				console.log(data);

				//launch the progress bar
				// $rootScope.showPB(true);
				// $rootScope.disabled = true;

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

				//checks
				var error_message = '';
				if (filtered_fields.length > 2)
					error_message = data.chart + 'Chart should have 1 or 2 fields';

				if (data.chart === EnumCharts.scatter && filtered_fields.length !== 2)
					error_message = data.chart + 'Plot should have 2 fields';

				if (error_message){

					$mdToast.show(
						$mdToast.simple()
							.textContent(error_message)
							.action('OK')
							.position('bottom')
							.hideDelay(4000)
					);

					// $rootScope.showPB(false);
					// $rootScope.disabled = false;
					return;
				}	

				//create chart object
				var chart = {};
				chart.id = 'chart_' + Math.floor(Math.random()*2000); //random
				chart.type = data.chart;
				chart.key1 = filtered_fields[0].field.name;
				chart.key2 = (filtered_fields[1]) ? filtered_fields[1].field.name : null;
				chart.ts_key = (data.chart === EnumCharts.graph) ? 'time' : null;

				//add to the charts list
				$rootScope.droppedCharts.push(chart);

				//wait for the DOM elements
				//to be added then trace
				setTimeout(function() {

					// var dc_chart = ChartsService.traceOne(chart.type, '#' + chart.id, chart.key1, chart.key2, chart.ts_key);
					var dc_chart = ChartsService.traceOne(chart.type, chart.id, chart.key1, chart.key2, chart.ts_key);
					dc_chart.render();

					//also render the counter
					ChartsService.counter('#counter').render();

					//hide the progress bar
					console.log('hereeeee');
					// $rootScope.showPB(false);
					console.log('and herreee');
					// $rootScope.disabled = false;

				}, 300);
			}


		}

		$scope.reload = function(){

			$rootScope.showPB(true);
			console.log('reload!!!');

			//load the data
			ChartsService.load($rootScope.dataset);
			console.log('load done');

			//draw all the charts
			$rootScope.droppedCharts.forEach(function(chart, index){

				console.log('chart:');
				console.log(chart);
				chart = ChartsService.traceOne(chart.type, '#' + chart.id, chart.key1, chart.key2, chart.ts_key);
				chart.render();
			});

			//also render the counter
			ChartsService.counter('#counter').render();
			console.log('done');
			$rootScope.showPB(false);
			//rendering
			// dc.renderAll();

			//dc.redrawAll();
		}

	});