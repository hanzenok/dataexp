angular.module('MainApp')
	.service('CanvasChartsService', function(){
		
		//data containers
		var dataset;

		var pie_chart = function(container, key1, key2, ts_key){

			//dimension
			var dim = ndx.dimension(function(d){return d[key1];}); //+d for number representation of an object

			//grouping
			var group = (!key2) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

			//chart
			var chart = dc.pieChart(container);

			//default values
			chart.width(319).height(319)
			.dimension(dim).group(group)
			.innerRadius(20).radius(159);

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

			//chart.render();
			return chart;
		}

		var graph = function(container, key1, key2, ts_key){
			
			//generate dataset
			var canvas_dataset = [];
			var tmp;
			dataset.forEach(function(doc, index){

				tmp = {};
				tmp.x = new Date(doc[ts_key]);
				tmp.y = doc[key1];

				canvas_dataset.push(tmp);
			});

			var composite_chart = new CanvasJS.Chart(container,
			    {
			    backgroundColor: '#FAFAFA',
			    width: 758,
			    height: 323,
			    data: [
			    {        
			        type: "line",
			        dataPoints: canvas_dataset
			    }
			    ]
			});

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

		var correlation = function(container, key1, key2){
	
			//reduce functions	
			var freduceAdd = function(p, v){		
				++p.n;
				p.sum_xy += (+v[key1]*+v[key2]);
				p.sum_x += +v[key1];
				p.sum_y += +v[key2];
				p.sum_x2 += (+v[key1]*+v[key1]);
				p.sum_y2 += (+v[key2]*+v[key2]);		
					
				return p;
			};

			var freduceRemove = function(p, v){
				--p.n;
				p.sum_xy -= (+v[key1]*+v[key2]);
				p.sum_x -= +v[key1];
				p.sum_y -= +v[key2];
				p.sum_x2 -= (+v[key1]*+v[key1]);
				p.sum_y2 -= (+v[key2]*+v[key2]);	
				return p;
			};

			var freduceInitial = function(){
				return {n: 0, sum_xy: 0, sum_x: 0, sum_y:0, sum_x2:0, sum_y2:0};
			}

			//dimension
			var dim = ndx.groupAll().reduce(freduceAdd, freduceRemove, freduceInitial);

			//chart
			var chart = dc.numberDisplay(container);

			//default values
			chart.formatNumber(d3.format(".4g"))
			.group(dim)
			.valueAccessor(function(p){	
				if(p.n == 0) return 0;

				return (p.n*p.sum_xy - p.sum_x*p.sum_y) / (Math.sqrt( (p.n*p.sum_x2 - p.sum_x*p.sum_x) * (p.n*p.sum_y2 - p.sum_y*p.sum_y) ));
			});

			return chart;
		}

		var scatter = function(container, key1, key2){

			//dimensions
			var dim = ndx.dimension(function(d){return [+d[key1], +d[key2]];});

			//grouping
			var group = dim.group();

			//chart
			var chart = dc.scatterPlot(container);

			//default values
			chart.width(600).height(300)
			.dimension(dim).group(group)
			.x(d3.scale.linear().domain([]))
			.renderHorizontalGridLines(true)
			.renderVerticalGridLines(true)
			.elasticX(true).elasticY(true).brushOn(true)
			.margins({top: 20, right: 30, bottom: 30, left: 50})
			.xAxisLabel(key1).yAxisLabel(key2);

			//render the correlation value
			correlation(container  + '_correl', key1, key2).render();

			//chart.render();
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