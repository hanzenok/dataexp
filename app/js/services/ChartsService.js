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
	
			//parse time format
			dataset.forEach(function(doc){
				
				doc[ts_key] = new Date(doc[ts_key]);

			});

			//dimension
			var dim = ndx.dimension(function(d){return d[ts_key]});
			
			//grouping
			var group = (!key1) ? dim.group() : dim.group().reduceSum(function(d) {return d[key1];});	
			
			//min,max
			var min_val={}, max_val={};
			min_val = dim.bottom(1)[0][ts_key];
			max_val = dim.top(1)[0][ts_key];
			
			//chart
			var chart = dc.lineChart(container);

			//default values
			chart.width(800).height(200)
			.dimension(dim).group(group)
			.x(d3.time.scale().domain([min_val, max_val]))
			.renderArea(true).elasticY(true)
			.elasticX(true)
			.renderHorizontalGridLines(true)
	    	.renderVerticalGridLines(true)
			.margins({top: 20, right: 20, bottom: 20, left: 30});
			
			if(!key1){
				chart.yAxisLabel('#');		
			}
			else{
				chart.yAxisLabel(key1);
			}

			return chart;
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