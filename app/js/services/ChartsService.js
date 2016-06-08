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

		var graph = function(container, key1, key2, ts_key){
	
			var day_parser = d3.time.format('%Y-%m-%d').parse;

			//parse time format
			dataset.forEach(function(doc){
				
				doc[ts_key] = new Date(doc[ts_key]);
				doc.day = day_parser(doc[ts_key].getFullYear() + '-' + (doc[ts_key].getMonth()+1) + '-' +  doc[ts_key].getDate());
			});

			//dimension
			var dim = ndx.dimension(function(d){return d[ts_key]});
			
			//grouping
			var group1 = dim.group().reduceSum(function(d) {return d[key1];});	
			
			//min,max
			var min_val={}, max_val={};
			min_val = dim.bottom(1)[0][ts_key];
			max_val = dim.top(1)[0][ts_key];
			
			//charts
			var composite_chart = dc.compositeChart(container);
			var line_chart1 = dc.lineChart(composite_chart);
			var line_chart2 = dc.lineChart(composite_chart);
			var bar_chart = dc.barChart('#bar-chart');

			//line_chart1
			line_chart1.dimension(dim)
			.group(group1, key1).colors('red')
			.x(d3.time.scale().domain([min_val, max_val]));

			//default values
			composite_chart.width(800).height(200)
			.dimension(dim).group(group1)
			.compose([line_chart1])
			.rangeChart(bar_chart)
			.x(d3.time.scale().domain([min_val, max_val]))
			.elasticY(true).elasticX(false)
			.brushOn(false).yAxisLabel(key1)
			.renderHorizontalGridLines(true)
	    	.renderVerticalGridLines(true)
			.margins({top: 20, right: 20, bottom: 20, left: 30});

			//scroll bar_chart
			var dim_days = ndx.dimension(function(d){return d.day;});
			var group_days = dim_days.group();

			bar_chart.width(800).height(50)
			.dimension(dim_days).group(group_days)
			.x(d3.time.scale().domain([min_val, max_val]));
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

		this.traceOne = function(chart_type, container, key1, key2, ts_key){

			return ChartsEnum[chart_type].call(this, container, key1, key2, ts_key);
		}

	});