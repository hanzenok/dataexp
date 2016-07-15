angular.module('MainApp')
	.service('CanvasChartsService', function(){
		
		//data containers
		var dataset;

		//calculate the occurences of specific key
		//in the array of objects
		//[{a:1}, {a:1}, {a:2}, {a:3}, {a:3}] ==> [ [1,2,3], [2,1,2] ]
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

		var pie_chart = function(container, key1, key2, ts_key){

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

		var row_chart = function(container, key1, key2){

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

		var bar_chart = function(container, key1, key2){
	
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

		//enum with all the renderers
		var ChartsEnum = {

			'Pie': pie_chart,
			'Timeline': timeline,
			'Scatter': scatter,
			'Row': row_chart,
			'Bar': bar_chart
		};

		//load the dataset
		this.load = function(data, err_callback){

			console.log('Canvas.js load');
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

		this.traceOne = function(chart_type, container, key1, key2, ts_key){

			return ChartsEnum[chart_type].call(this, container, key1, key2, ts_key);
		}

		this.type = 'canvas';

	});