angular.module('MainApp')
	.service('CanvasChartsService', function(){
		
		//data containers
		var dataset;

		//counts the occurences
		//of documents with key + value
		var counted = [];
		var count_occur = function(array, key, value){

			var counter = 0;

			//check if already counted
			// var pos = counted.map(function(e) {return e.key;}).indexOf(value);
			// console.log('pos: ' + pos);
			
			//count
			array.forEach(function(doc, index){

				if (doc[key] === value)
					counter++;
			});

			//add to counted
			// counted.push({key: key, count: count});

			console.log('key: ' + key + ', value: ' + value + ', counter: ' + counter);	
			return counter;
		}

		var pie_chart = function(container, key1, key2, ts_key){

			var canvas_dataset = [];
			var tmp;

			//generate dataset
			dataset.forEach(function(doc, index){

				tmp = {};
				
				tmp.y = parseFloat(doc[key1]);
				tmp.label = '' + count_occur.call(this, dataset, key1, doc[key1]);

				canvas_dataset.push(tmp);
			});

			console.log(canvas_dataset);
			function onlyUnique(value, index, self) {return self.indexOf(value) === index;}
			var canvas_dataset2 = canvas_dataset.filter(onlyUnique);
			console.log(canvas_dataset2);

			//data array
			var data = [];
			data.push({

				type:'pie',
				radius: "100%",
				indexLabelPlacement: 'inside',
				dataPoints: canvas_dataset
			});

			//chart config
			var config = {

				theme:'theme4',
				backgroundColor: '#FAFAFA',
				width: 319,
				height: 319,
				data: data
			};

			//generate chart
			var chart = new CanvasJS.Chart(container, config);

			return chart;
		}

		var graph = function(container, key1, key2, ts_key){
			
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

			//dimension
			var dim = ndx.dimension(function(d){return d[key1];});
			
			//grouping
			var group = (!key2) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

			//chart
			var chart = dc.rowChart(container);
			
			//default values
			chart.width(600).height(319)
			.elasticX(true)
			.dimension(dim).group(group)
			.margins({top: 20, right: 20, bottom: 20, left: 20})
			.xAxis().tickFormat(d3.format('s'));

			//on hover text and axis labels
			if (!key2){
				chart.title(function(d){
					return "(" + d.key + ")" 
					+ "\n" + d.value;
				});
			}
			else{
				chart.title(function(d){
					return "(" + d.key + ")"
					+ "\n" + key2
					+ ": " + d.value; 
				});
			}

			//chart.render();
			return chart;
		}

		var bar_chart = function(container, key1, key2){
	
			//dimension
			var dim = ndx.dimension(function(d){return d[key1];});
			
			//grouping
			var group = (!key2) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

			//chart
			var chart = dc.barChart(container);
			
			//default values
			chart.width(600).height(319)
			.dimension(dim).group(group)
			.renderHorizontalGridLines(true)
			.renderVerticalGridLines(true)
			.elasticY(true).xAxisLabel(key1)
			.x(d3.scale.ordinal().domain(dim))
			.xUnits(dc.units.ordinal)
			.yAxis().tickFormat(d3.format('s'));
			chart.margins({top: 20, right: 20, bottom: 50, left: 50});

			//on hover text and axis labels
			if (!key2){
				chart.title(function(d){
					return "(" + d.key + ")" 
					+ "\n" + d.value;
				})
				.yAxisLabel('#');
			}
			else{
				chart.title(function(d){
					return "(" + d.key + ")"
					+ "\n" + key2
					+ ": " + d.value; 
				})
				.yAxisLabel(key2);
			}

			//chart.render();
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
				width: 600,
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
			'Graph': graph,
			'Scatter': scatter,
			'Row': row_chart,
			'Bar': bar_chart
		};

		//load the dataset
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

		this.traceOne = function(chart_type, container, key1, key2, ts_key){

			return ChartsEnum[chart_type].call(this, container, key1, key2, ts_key);
		}

	});