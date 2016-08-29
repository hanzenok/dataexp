/**
 * Angualr.js controllers.
 * @module client
 * @submodule Controllers
 */

/**
 * A controller that serves 
 * the container of DC.js and Canvas.js charts
 * in the <code>index.html</code> view.
 * <br/>
 * It uses two custom angular services:
 * - <b>DCChartsService</b>: generates the DC.js charts
 * - <b>CanvasChartsService</b>: generates the Canvas.js charts
 *
 * It defines three methods that should be explained:
 * - <b>renderAll()</b>: a method that launches automatically
 * when all the DOM elements needed for rendering all 
 * the charts from the <code>$rootScope.droppedCharts</code> list where generated
 * (but charts not yet traced). This is done by using angular <code>$last</code> directive.
 * When the method is launched, if the boolean <code>$scope.reload</code> is true, it traces
 * all the charts from the <code>$rootScope.droppedCharts</code> list.
 * It is done this way, because in order to trace a DC.js or Canvas.js charts,
 * all the DOM containers (divs) should be already present (and we are generating them progrmatically).
 * - <b>onDropChart()</b>: a method that traces only one chart, when the 'movable chart'
 * is dropped to the charts container. It also adds it to the <code>$rootScope.droppedCharts</code>
 * list, which will trigger automatically the <b>renderAll()</b> function, that will retrace all
 * for the second time. To prevent this, the <b>onDropChart()</b> method sets the variable 
 * <code>$scope.reload</code> to false.
 * - <b>reloadCharts()</b>: a method that deletes all the DOM elements chart containers,
 * and then reintroduces them. Which triggers the <b>renderAll()</b> method that traces all the 
 * charts. To allow it, the <b>reloadCharts()</b> sets the variable <code>$scope.reload</code> to true.
 * @class ChartsCtrl
 */
angular.module('MainApp')
	.controller('ChartsCtrl', function ($scope, $rootScope, $http, $mdToast, DCChartsService, CanvasChartsService) {

		//chart types
		var EnumCharts = {
							pie: 'Pie',
							timeline: 'Timeline',
							scatter: 'Scatter',
							row: 'Row',
							bar: 'Bar'
						};
		/**
		* @property reload
		* @type boolean
		* @description A <b>local scope</b> variable
		* that is used to trigger (or not)
		* the <b>renderAll()</b> method
		* to reload all the charts.
		*/
		$scope.reload = false;

		/**
		* @property hideTitle
		* @type boolean
		* @description A <b>local scope</b> variable
		* that is used to show/hide
		* the message 'Rendering ...' while
		* the chart (DC.js or Canvas.js) is rendering.
		*/		
		$scope.hideTitle = false; //'Rendering ...' title

		/**
		* @property droppedCharts
		* @type array
		* @description A <b>root scope</b> variable
		* that holds all the dropped movable charts
		* on the charts container in the <code>index.html</code>.
		*/
		$rootScope.droppedCharts = []; //dropped charts container

		/**
		* A <b>local scope</b> method that fires
		* when a movable chart is dropped on the 
		* charts container in the <code>index.html</code>
		* and traces a chart (DC.js or Canvas.js).
		* @method onDropChart
		* @param data Dropped object
		*/
		$scope.onDropChart = function(data){

			//if dropped is a movable chart
			if (data && data.chart && $rootScope.chartFields.length){

				//to show to the $scope.renderAll function
				//that we are adding a new chart
				//and not reloading all the charts
				$scope.reload = false;

				//show title
				$scope.hideTitle = false;

				//launch the progress bar
				$rootScope.showPB(true);

				//filtering all the dropped fields
				//by chart type
				var filtered_fields = [];
				var fields = $rootScope.chartFields;
				var n = fields.length;
				for (var i=0; i<n; i++){

					if (fields[i].chart === data.chart){
						
						filtered_fields.push(fields[i]);
					}
				}

				//checks
				var error_message = '';
				var nb_fields = filtered_fields.length;
				if (nb_fields > 2)
					error_message = data.chart + 'Chart should have 1 or 2 fields';

				if (data.chart === EnumCharts.scatter && nb_fields !== 2)
					error_message = data.chart + 'Plot should have 2 fields';

				if ($rootScope.force_canvasjs || $rootScope.size_status === 'overflow'){

					if (nb_fields > 1 && (data.chart === EnumCharts.pie || data.chart === EnumCharts.row))
						error_message = 'Canvas.js PieChart and RowChart should have only 1 field';

					if (nb_fields > 1 && data.chart === EnumCharts.bar){

						//check for the timestamp fields
						error_message = 'Canvas.js BarChart should have only 1 '; //non-timestamp field;
						for(var i=0; i<n; i++){

							if (filtered_fields[i].field.format){

								error_message += 'non-timestamp ';
								break;
							}
						}
						error_message += 'field';
					}

					if (nb_fields === 1 && data.chart === EnumCharts.bar && filtered_fields[0].field.format){

						error_message = 'Canvas.js BarChart should have only non-timestamp field';
					}
				}

				if (error_message){

					//stop the progress bar
					$rootScope.$apply(function(){
						$rootScope.showPB(false);
					});

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
				chart_config.id = 'chart_' + Math.floor(Math.random()*2000); //random DOM id
				chart_config.type = data.chart;
				chart_config.key1 = filtered_fields[0].field.name;
				chart_config.key2 = (filtered_fields[1]) ? filtered_fields[1].field.name : null;
				chart_config.ts_key = (data.chart === EnumCharts.timeline || data.chart === EnumCharts.bar) ? 'time' : null; //timestamp key

				//check if user added a timestamp to the barchart
				//this timestamp is different from ts_key because
				//it is a key before the dataset goes throug tsproc
				if (chart_config.type === EnumCharts.bar){

					//first key
					if(filtered_fields[0].field.format){

						chart_config.key1 = chart_config.ts_key;
					}

					//or second
					if (chart_config.key2 && filtered_fields[1].field.format){

						chart_config.key2 = chart_config.ts_key;
					}
				}

				//add to the charts list
				$rootScope.droppedCharts.push(chart_config);

				//wait for the DOM elements
				//to be added then trace
				setTimeout(function() {

					var chart_service = ($rootScope.size_status === 'overflow' || $rootScope.force_canvasjs) ? CanvasChartsService : DCChartsService;
					var chart = chart_service.getChart(chart_config.type, chart_config.id, chart_config.key1, chart_config.key2, chart_config.ts_key);
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

		/**
		* A <b>root scope</b> method that fires
		* on clicking the FAB button in the main 
		* container. It reloads all the charts (DC.js or Canvas.js)
		* from the <code>$rootScope.droppedCharts</code>.
		* @method reloadCharts
		*/
		$rootScope.reloadCharts = function(){

			//copy the charts before cleaning
			var new_charts = [];
			$rootScope.droppedCharts.forEach(function(chart, index){

				new_charts.push(chart);
			});

			//drop the list of charts to clear
			//up the DOM elements
			$rootScope.droppedCharts = [];

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

					//reintroduce the charts list
					$rootScope.$apply(function () {
						$rootScope.droppedCharts = new_charts;
					});

			}, 300);
		}


		//launched when the list of charts in the DOM
		//is finished generating
		/**
		* A <b>local scope</b> method that
		* launches automatically when all the DOM
		* elements-containers for charts from the 
		* <code>$rootScope.droppedCharts</code> where generated.
		* When launched, it traces all the charts from the <code>$rootScope.droppedCharts</code>
		* list.
		* @method renderAll
		*/
		$scope.renderAll = function(){

			//check if we are reloading all the charts
			//if not this function would be launched during
			//the chart dropps
			if ($scope.reload){

				//show title
				$scope.hideTitle = false;

				//launch the progress bar
				$rootScope.showPB(true);

				//wait for the dom
				setTimeout(function(){

					//render all charts
					var chart_service = ($rootScope.size_status === 'overflow' || $rootScope.force_canvasjs) ? CanvasChartsService : DCChartsService;
					$rootScope.droppedCharts.forEach(function(chart_config, index){

						var chart = chart_service.getChart(chart_config.type, chart_config.id, chart_config.key1, chart_config.key2, chart_config.ts_key);
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