/**
 * Angualr.js services.
 * @module client
 * @submodule Services
 */

/**
 * A service that wraps 
 * a Canvas.js charting library and 
 * offers two public methods:
 * - <b>load()</b>: loads the data (json array)
 * that should be visualysed
 * - <b>getChart()</b>: returns the chart
 * filled with the data from the <b>load()</b> function.
 * The chart can be then traced by calling <i>render()</i>
 * function on it.
 * @class CanvasChartsService
 */
angular.module('MainApp')
	.service('CanvasChartsService', function(){
		
		/**
		* @property dataset
		* @type array
		* @description A local variable
		* that holds the loaded dataset.
		*/
		var dataset;

		/**
		* A private method that 
		* counts the number of occurences
		* of a specific field(key) in the array.
		* Creted because Canvas.js is not doing this
		* operation by default like DC.js.
		* @method count_obj_occurs
		* @param {array} array A json array where the occurences should be counted
		* @param {string} key A key which values should be counted
		* @return {array} A two-dimensional array with each value, and their respective count (cf example)
		* @example
		*     var array = [{a:1}, {a:1}, {a:2}, {a:3}, {a:3}];
		*     console.log(count_obj_occurs.call(this, array, 'a')); //[ [1,2,3], [2,1,2] ]
		*/
		var count_obj_occurs = function(array, key){

			var counted = [];
			var count = [];

			var i=0, j=0, k=0, l;
			var m,n = array.length;
			var index;

			while (k < n){

				//find if already conuted
				var m = counted.length;
				index = -1;
				for (l=0; l<m; l++){

					if (array[k][key] === counted[l]){

						index = l;
						break;
					}
				}

				//if not yet counted
				if (index < 0){

					//mark as counted
					counted.push(array[k][key]);

					//count
					count.push(0);
					for (j=0; j<n; j++){

						if (counted[i] === array[j][key]){

							count[i]++;
						}
					}

					i++;
				}
				else{
					k++;
				}
			}

			return [counted, count];
		}

		/**
		* A private method that returns a 
		* Cavnas.js pie chart. 
		* Only works with one field.
		* @method pie_chart
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		var pie_chart = function(container, key1){

			var canvas_dataset = [];
			var tmp;

			//count the occurences
			var counts = count_obj_occurs.call(this, dataset, key1);

			//generate dataset
			var n = counts[0].length;
			for (var i=0; i<n; i++){

				tmp = {};
				
				tmp.label = '' + counts[0][i];
				tmp.y = parseFloat(counts[1][i]);

				canvas_dataset.push(tmp);
			};

			//data array
			var data = [];
			data.push({

				type:'pie',
				radius: '100%',
				startAngle: 270,
				indexLabelFontFamily: "Garamond",       
				indexLabelFontSize: 15,
				indexLabelFontWeight: "bold",
				startAngle:0,
				indexLabelFontColor: "MistyRose",       
				indexLabelLineColor: "darkgrey",
				indexLabelPlacement: 'inside',
				dataPoints: canvas_dataset
			});

			//chart config
			var config = {

				theme:'theme4',
				backgroundColor: '#FAFAFA',
				width: 335,
				height: 323,
				data: data
			};

			//generate chart
			var chart = new CanvasJS.Chart(container, config);

			return chart;
		}

		/**
		* A private method that returns a 
		* Cavnas.js timeline.
		* Can work with two fields.
		* @method timeline
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @param {string} key2 A second key that should be visualised 
		* @param {string} ts_key A timestamp key
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		var timeline = function(container, key1, key2, ts_key){
			
			var canvas_dataset = [];
			var canvas_dataset2 = [];
			var tmp;

			//generate primary dataset
			dataset.forEach(function(doc, index){

				tmp = {};
				
				tmp.x = new Date(doc[ts_key]);
				tmp.y = parseFloat(doc[key1]);

				canvas_dataset.push(tmp);
			});

			//generate secondary dataset
			if (key2){

				dataset.forEach(function(doc, index){

					tmp = {};

					tmp.x = new Date(doc[ts_key]);
					tmp.y = parseFloat(doc[key2]);

					canvas_dataset2.push(tmp);
				});
			}

			//generate data array
			var data = [];
			data.push({

				type: 'line',
				lineThickness: 1.5,
				lineColor: 'red',
				dataPoints: canvas_dataset
			});

			if (canvas_dataset2.length){

				data.push({

					type: 'line',
					axisYType: 'secondary',
					lineThickness: 1.5,
					lineColor: 'blue',
					dataPoints: canvas_dataset2
				});
			}

			//chart config
			var config = {

				zoomEnabled: true,
				theme: 'theme4',
				axisY:{
					title: key1,
					gridColor: 'gray',
					gridThickness: 0.1
				},
				axisX:{
					gridColor: 'gray',
					gridThickness: 0.1
				},
				backgroundColor: '#FAFAFA',
				width: 800,
				height: 323,
				data: data
			};
			if (canvas_dataset2.length){

				config.axisY2 = {title: key2};
			}

			//generate chart
			var composite_chart = new CanvasJS.Chart(container, config);

			return composite_chart;
		}

		/**
		* A private method that returns a 
		* Cavnas.js row chart.
		* Only works with one field.
		* @method row_chart
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		var row_chart = function(container, key1){

			var canvas_dataset = [];
			var tmp;

			//count the occurences
			var counts = count_obj_occurs.call(this, dataset, key1);

			//generate dataset
			var n = counts[0].length;
			for (var i=0; i<n; i++){

				tmp = {};
				
				tmp.label = counts[0][i];
				tmp.y = parseFloat(counts[1][i]);

				canvas_dataset.push(tmp);
			};

			//data array
			var data = [];
			data.push({

				type:'bar',
				dataPoints: canvas_dataset
			});

			//chart config
			var config = {

				theme:'theme4',
				backgroundColor: '#FAFAFA',
				axisX: {
					title: key1
				},
				axisY: {
					title: '#',
					gridColor: 'gray',
					gridThickness: 0.1
				},
				width: 590,
				height: 319,
				data: data
			};

			//generate chart
			var chart = new CanvasJS.Chart(container, config);

			return chart;
		}

		/**
		* A private method that returns a 
		* Cavnas.js bar chart.
		* Only works with one field.
		* @method bar_chart
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		var bar_chart = function(container, key1){
	
			var canvas_dataset = [];
			var tmp;

			//count the occurences
			var counts = count_obj_occurs.call(this, dataset, key1);

			//generate dataset
			var n = counts[0].length;
			for (var i=0; i<n; i++){

				tmp = {};
				
				tmp.label = counts[0][i];
				tmp.y = parseFloat(counts[1][i]);

				canvas_dataset.push(tmp);
			};

			//data array
			var data = [];
			data.push({

				type:'column',
				dataPoints: canvas_dataset
			});

			//chart config
			var config = {

				theme:'theme4',
				backgroundColor: '#FAFAFA',
				axisX: {
					title: key1,
				},
				axisY: {
					title: '#',
					gridColor: 'gray',
					gridThickness: 0.1
				},
				width: 590,
				height: 319,
				data: data
			};

			//generate chart
			var chart = new CanvasJS.Chart(container, config);

			return chart;
		}

		/**
		* A private method that returns a 
		* Cavnas.js scatter plot.
		* Only works with two fields.
		* @method scatter
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A x axis
		* @param {string} key2 A y axis
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		var scatter = function(container, key1, key2){

			var canvas_dataset = [];
			var tmp;

			//generate dataset
			dataset.forEach(function(doc, index){

				tmp = {};
				
				tmp.x = parseFloat(doc[key1]);
				tmp.y = parseFloat(doc[key2]);

				canvas_dataset.push(tmp);
			});

			//data array
			var data = [];
			data.push({

				type: 'scatter',
				dataPoints: canvas_dataset
			});

			//chart config
			var config = {

				theme:'theme4',
				zoomEnabled: true,
				backgroundColor: '#FAFAFA',
				axisY:{
					title: key1,
					gridColor: 'gray',
					gridThickness: 0.1
				},
				axisX:{
					title: key2,
					gridColor: 'gray',
					gridThickness: 0.1
				},
				width: 580,
				height: 319,
				data: data
			};

			//generate chart
			var chart = new CanvasJS.Chart(container, config);

			return chart;
		}

		/**
		* @property ChartsEnum
		* @type json
		* @description A local variable
		* that holds all the chart names
		* and their related methods.
		*/
		var ChartsEnum = {

			'Pie': pie_chart,
			'Timeline': timeline,
			'Scatter': scatter,
			'Row': row_chart,
			'Bar': bar_chart
		};

		/**
		* A public method that loads the data
		* to visualise into the local
		* variable <code>dataset</code>.
		* Also checks the presence of the 
		* Canvas.js library.
		* @method load
		* @param {array} data Data that should be visualised
		* @param {callback} err_callback An error callback
		*/
		this.load = function(data, err_callback){

			//check if all the libraries
			//are imported
			if (typeof CanvasJS === 'undefined'){

				err_callback(new Error('Canvas.js is missing'));
				return;
			}

			//all good
			dataset = data;
			err_callback(null);
		}

		/**
		* A public method that returns a 
		* Cavnas.js chart specified by <code>chart_type</code>
		* @method getChart
		* @param {string} chart_type A type of chart from the <code>ChartsEnum</code>
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @param {string} key2 A second key that should be visualised 
		* @param {string} ts_key A timestamp key
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		this.getChart = function(chart_type, container, key1, key2, ts_key){

			return ChartsEnum[chart_type].call(this, container, key1, key2, ts_key);
		}
	});