angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http, $mdToast, $mdColorPalette, DCChartsService, CanvasChartsService) {

		var EnumCharts = {
							pie: 'Pie',
							timeline: 'Timeline',
							scatter: 'Scatter',
							row: 'Row',
							bar: 'Bar'
						};

		$scope.reload = false;
		$scope.hideTitle = false;
		$rootScope.droppedCharts = [];

		$scope.onDropChart = function(data){

			//if dropped object not a DC.js chart
			if (data && data.chart && $rootScope.chartFields.length){

				//to shot to the $scope.renderAll function
				//that we are adding a new chart
				//and not reloading all the charts
				$scope.reload = false;

				//show title
				$scope.hideTitle = false;

				//launch the progress bar
				$rootScope.showPB(true);

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

					return;
				}	

				//create chart object
				var chart_config = {};
				chart_config.id = 'chart_' + Math.floor(Math.random()*2000); //random
				chart_config.type = data.chart;
				chart_config.key1 = filtered_fields[0].field.name;
				chart_config.key2 = (filtered_fields[1]) ? filtered_fields[1].field.name : null;
				chart_config.ts_key = (data.chart === EnumCharts.timeline) ? 'time' : null;

				//add to the charts list
				$rootScope.droppedCharts.push(chart_config);

				//wait for the DOM elements
				//to be added then trace
				setTimeout(function() {

					var chart_service = ($rootScope.size_status === 'overflow' || $rootScope.force_canvasjs) ? CanvasChartsService : DCChartsService;
					var chart = chart_service.traceOne(chart_config.type, chart_config.id, chart_config.key1, chart_config.key2, chart_config.ts_key);
					chart.render();

					//hide the title
					$scope.hideTitle = true;

					//stop the progress bar
					$rootScope.$apply(function(){
						$rootScope.showPB(false);
					});

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

			//remove the svg for DC.js
			// d3.selectAll('svg').remove();

			//wait for the dom elements to be deleted
			setTimeout(function() {

					//load the data
					var chart_service = ($rootScope.size_status === 'overflow' || $rootScope.force_canvasjs) ? CanvasChartsService : DCChartsService;
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

					//to inform the $scope.renderAll function
					//that we are reloading
					$scope.reload = true;

					//reintroduce the chats list
					$rootScope.$apply(function () {
						$rootScope.droppedCharts = new_charts;
					});

			}, 300);
		}


		//launched when the list of charts in the DOM
		//is finished generating
		$scope.renderAll = function(){

			//check if we are reloading all the charts
			//if not this function would be launched during
			//the chart dropps
			if ($scope.reload){

				//shot title
				$scope.hideTitle = false;

				//launch the progress bar
				$rootScope.showPB(true);

				//wait for the dom
				setTimeout(function(){

					//render all charts
					var chart_service = ($rootScope.size_status === 'overflow' || $rootScope.force_canvasjs) ? CanvasChartsService : DCChartsService;
					$rootScope.droppedCharts.forEach(function(chart_config, index){

						var chart = chart_service.traceOne(chart_config.type, chart_config.id, chart_config.key1, chart_config.key2, chart_config.ts_key);
						chart.render();
					});

					//hide the title
					$scope.hideTitle = true;

					//stop the progress bar
					$rootScope.$apply(function(){
						$rootScope.showPB(false);
					});
					

				}, 300);
			}
		}

	});