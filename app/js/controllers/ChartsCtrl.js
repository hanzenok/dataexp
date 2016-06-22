angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http, $mdToast, $mdColorPalette, DCChartsService, CanvasChartsService) {

		var EnumCharts = {
							pie: 'Pie',
							graph: 'Graph',
							scatter: 'Scatter',
							row: 'Row',
							bar: 'Bar'
						};

		$scope.reload = false;
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
				var chart_config = {};
				chart_config.id = 'chart_' + Math.floor(Math.random()*2000); //random
				chart_config.type = data.chart;
				chart_config.key1 = filtered_fields[0].field.name;
				chart_config.key2 = (filtered_fields[1]) ? filtered_fields[1].field.name : null;
				chart_config.ts_key = (data.chart === EnumCharts.graph) ? 'time' : null;

				//add to the charts list
				$rootScope.droppedCharts.push(chart_config);

				//wait for the DOM elements
				//to be added then trace
				setTimeout(function() {

					var chart_service = ($rootScope.size_status === 'overflow') ? CanvasChartsService : DCChartsService;
					var chart = chart_service.traceOne(chart_config.type, chart_config.id, chart_config.key1, chart_config.key2, chart_config.ts_key);
					chart.render();

				}, 300);
			}


		}

		$rootScope.reloadCharts = function(){

			//copy the charts before cleaning
			var new_charts = [];
			$rootScope.droppedCharts.forEach(function(chart, index){

				new_charts.push(chart);
			});

			//drop the list of charts to clear
			//up the dom elements
			$rootScope.droppedCharts = [];

			//wait for the dom elements to be deleted
			setTimeout(function() {

				//reintroduce the charts
				// $rootScope.droppedCharts = new_charts;

				// console.log('id: #' + new_charts[0].id);
				// angular.element('#' + new_charts[0].id).ready(function(){

				// 	console.log('ready');
				// });

				//give the dom elements the time to
				//to generate themsefls
				// setTimeout(function(){

					console.log('after the wait');

					//load the data
					var chart_service = ($rootScope.size_status === 'overflow') ? CanvasChartsService : DCChartsService;
					chart_service.load($rootScope.dataset, function(err){

						if (err){
							$mdToast.show(
								$mdToast.simple()
									.textContent(err.message)
									.action('OK')
									.position('bottom')
									.hideDelay(4000)
							);
						}
					});

					$scope.reload = true;
					$rootScope.droppedCharts = new_charts;
					

				// setTimeout(function(){
				// 	console.log('load done');
				// 	console.log('charts count:');
				// 	console.log($scope.charts_count);

				// 	//draw all the charts
				// 	$rootScope.droppedCharts.forEach(function(chart_config, index){

				// 		console.log('chart:');
				// 		console.log(chart_config);
				// 		console.log(chart_service);
				// 		var chart = chart_service.traceOne(chart_config.type, chart_config.id, chart_config.key1, chart_config.key2, chart_config.ts_key);
				// 		chart.render();
				// 	});

				// 	console.log('All ended!!!!');

				// }, 3000);
			}, 300);
		}


		$scope.doSmth = function(){

			console.log('Finished loading!!!');
			console.log($scope.reload);

			if ($scope.reload){

				console.log('here1');
				setTimeout(function(){

					console.log('here2');
					console.log($rootScope.droppedCharts.length);
					var chart_service = ($rootScope.size_status === 'overflow') ? CanvasChartsService : DCChartsService;
					$rootScope.droppedCharts.forEach(function(chart_config, index){

						console.log('chart:');
						console.log(chart_config);
						console.log(chart_service);
						var chart = chart_service.traceOne(chart_config.type, chart_config.id, chart_config.key1, chart_config.key2, chart_config.ts_key);
						chart.render();
					});

					
				}, 300);
			}
		}

	});