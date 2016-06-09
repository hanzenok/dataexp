angular.module('MainApp')
	.service('ChartsService', function(){
		
		//data containers
		var dataset;
		var ndx;

		var pie_chart = function(container, key1, key2){

			//dimension
			var dim = ndx.dimension(function(d){return d[key1];}); //+d for number representation of an object

			//grouping
			var group = (!key2) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

			//chart
			var chart = dc.pieChart(container);

			//default values
			chart.width(200).height(200)
			.dimension(dim).group(group)
			.innerRadius(20).radius(100);

			//on hover text
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

			return chart;
		}

		var row_chart = function(container, key1, key2){

			//dimension
			var dim = ndx.dimension(function(d){return d[key1];});
			
			//grouping
			var group = (!key2) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

			//chart
			var chart = dc.rowChart(container);
			
			//default values
			chart.width(400).height(200)
			.elasticX(true)
			.dimension(dim).group(group)
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
			chart.width(600).height(200)
			.dimension(dim).group(group)
			.renderHorizontalGridLines(true)
			.renderVerticalGridLines(true)
			.elasticY(true).xAxisLabel(key1)
			.x(d3.scale.ordinal().domain(dim))
			.xUnits(dc.units.ordinal)
			.yAxis().tickFormat(d3.format('s'));
			chart.margins({top: 0, right: 0, bottom: 50, left: 50});

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

			return chart;
		}

		var graph = function(container, key1, keys, ts_key){
	
			if (keys && typeof keys === 'string'){

				keys = [keys];
			}

			//parse time format
			var day_parser = d3.time.format('%Y-%m-%d').parse;
			dataset.forEach(function(doc){
				
				doc[ts_key] = new Date(doc[ts_key]);
				doc.day = day_parser(doc[ts_key].getFullYear() + '-' + (doc[ts_key].getMonth()+1) + '-' +  doc[ts_key].getDate());
			});

			//dimensions
			var dim = ndx.dimension(function(d){return d[ts_key]});
			var dim_days = ndx.dimension(function(d){return d.day;});
			console.log('here0');
			
			//grouping
			var group_days = dim_days.group();
			var group1 = dim.group().reduceSum(function(d) {return d[key1];});
			var i,n,groups = null;
			console.log(keys);
			if (keys){
				
				n = keys.length;console.log('here: ' + n);
				groups = new Array(n);
				for (i=0; i<n; i++){

					var local_key = keys[i];
					groups[i] = dim.group().reduceSum(function(d){console.log(local_key); return d[local_key];});
				}
			}
			
			//min,max
			var min_val={}, max_val={};
			min_val = dim.bottom(1)[0][ts_key];
			max_val = dim.top(1)[0][ts_key];
			
			//charts
			var composite_chart = dc.compositeChart(container);
			var line_chart1 = dc.lineChart(composite_chart);
			var bar_chart = dc.barChart(container + '_bar');
			var line_charts = null;
			if (groups){
				console.log('here2: ' + n);
				line_charts = new Array(n);
				for (i=0; i<n; i++){

					line_charts[i] = dc.lineChart(composite_chart);
				}
			}

			//line_chart1
			line_chart1.dimension(dim)
			.group(group1, key1).colors('red')
			.x(d3.time.scale().domain([min_val, max_val]));

			//line_charts
			if (line_charts){
				console.log('here3: ' + n);
				for (i=0; i<n; i++){

					line_charts[i].dimension(dim)
					.group(groups[i], keys[i])
					.x(d3.time.scale().domain([min_val, max_val]));
				}
			}

			//composite chart
			composite_chart.width(800).height(200)
			.dimension(dim).group(group1)
			.rangeChart(bar_chart).shareTitle(false)
			.x(d3.time.scale().domain([min_val, max_val]))
			.elasticY(true).elasticX(false)
			.brushOn(false).yAxisLabel(key1)
			.renderHorizontalGridLines(true)
	    	.renderVerticalGridLines(true)
			.margins({top: 20, right: 40, bottom: 20, left: 40})
			.legend(dc.legend().x(60).y(10).itemWidth(200).gap(5).horizontal(true));
			
			//composing
			if (line_charts){
console.log('here4');
				var charts = [line_chart1];
				for (i=0; i<n; i++){

					charts.push(line_charts[i]);
				}
				composite_chart.compose(charts)
			}
			else{console.log('here5');
				composite_chart.compose([line_chart1]);
			}

			//scroll bar_chart
			bar_chart.width(800).height(75)
			.dimension(dim_days).group(group_days)
			.x(d3.time.scale().domain([min_val, max_val]))
			.margins({top: 20, right: 40, bottom: 20, left: 40});
			bar_chart.yAxis().ticks(0);
			bar_chart.xUnits(d3.time.hours);
			bar_chart.render();

			return composite_chart;
		}

		//enum with all the renderers
		var ChartsEnum = {

			'Pie': pie_chart,
			'Graph': graph,
			'Row': row_chart,
			'Bar': bar_chart
		};

		//load the dataset
		this.load = function(data){

			//check if all the libraries
			//are imported
			if (typeof crossfilter !== 'undefined' && 
				typeof d3 !== 'undefined' &&
				typeof dc !== 'undefined' && data){

				dataset = data;
				ndx = crossfilter(dataset);

				return true;
			}
			else{

				return false;
			}

		}

		this.counter = function(container){

			var chart = dc.numberDisplay(container);

			chart.group(ndx.groupAll())
			.formatNumber(d3.format('n'))
			.valueAccessor(function(d){return d;});

			return chart;
		}

		this.traceOne = function(chart_type, container, key1, keys, ts_key){

			return ChartsEnum[chart_type].call(this, container, key1, keys, ts_key);
		}

	});