angular.module('MainApp')
	.service('DCChartsService', function(){
		
		//data containers
		var dataset;
		var ndx;

		var pie_chart = function(container, key1, key2, ts_key){

			//dimension
			var dim = ndx.dimension(function(d){return d[key1];}); //+d for number representation of an object

			//grouping
			var group = (!key2) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

			//chart
			var chart = dc.pieChart('#' + container);

			//default values
			chart.width(319).height(319)
			.dimension(dim).group(group)
			.radius(145);

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

			//check if correlation field is present
			if (typeof dataset[0].correlation !== 'undefined'){

				//parse time format and correlation
				dataset.forEach(function(doc){
					
					doc[ts_key] = new Date(doc[ts_key]);

					if (!doc.correlation)
						doc.correlation = 0.2;
				});
			}
			else{

				//parse only time format
				dataset.forEach(function(doc){
					
					doc[ts_key] = new Date(doc[ts_key]);
				});
			}

			//dimensions
			var dim = ndx.dimension(function(d){return d[ts_key]});
			
			//grouping
			var group1 = dim.group().reduceSum(function(d) {return d[key1];});
			var group2 = (key2) ? dim.group().reduceSum(function(d){return d[key2];}) : null;
			var group_bar = (key2 && typeof dataset[0].correlation !== 'undefined') ? dim.group().reduceSum(function(d){return d.correlation;}) : group1;
			
			//min,max
			var min_val={}, max_val={};
			min_val = dim.bottom(1)[0][ts_key];
			max_val = dim.top(1)[0][ts_key];
			
			//charts
			var composite_chart = dc.compositeChart('#' + container);
			var line_chart1 = dc.lineChart(composite_chart);
			var line_chart2 = dc.lineChart(composite_chart);
			var bar_chart = dc.barChart('#' + container + '_bar');

			//line_chart1
			line_chart1.dimension(dim)
			.group(group1, key1).colors('red')
			.x(d3.time.scale().domain([min_val, max_val]));

			//line_chart2
			if (group2){

				line_chart2.dimension(dim)
				.group(group2, key2).colors('blue')
				.x(d3.time.scale().domain([min_val, max_val]))
				.useRightYAxis(true);
			}

			//composite chart
			composite_chart.width(800).height(240)
			.dimension(dim).group(group1)
			.rangeChart(bar_chart).shareTitle(false)
			.x(d3.time.scale().domain([min_val, max_val]))
			.elasticY(true).elasticX(false)
			.brushOn(false).yAxisLabel(key1)
			.renderHorizontalGridLines(true)
	    	.renderVerticalGridLines(true)
			.margins({top: 20, right: 50, bottom: 20, left: 50});
			
			//composing
			if (group2){

				composite_chart.compose([line_chart1, line_chart2])
				.rightYAxisLabel(key2);
			}
			else{
				composite_chart.compose([line_chart1]);
			}

			bar_chart.on('pretransition', function (chart) {

				chart.selectAll('g rect').style('fill', function (d) {
					
					if (d.data && d.data.value >= 0.6){

						return color_gen.call(this, d.data.value);
					}
					else{
						return 'gray';
					}
				});
			});

			//scroll bar_chart
			bar_chart.width(800).height(75)
			.dimension(dim).group(group_bar)
			.x(d3.time.scale().domain([min_val, max_val]))
			.margins({top: 20, right: 50, bottom: 20, left: 50});
			bar_chart.yAxis().ticks(0);
			bar_chart.xUnits(d3.time.hours);
			bar_chart.render();

			return composite_chart;
		}

		var row_chart = function(container, key1, key2){

			//dimension
			var dim = ndx.dimension(function(d){return d[key1];});
			
			//grouping
			var group = (!key2) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

			//chart
			var chart = dc.rowChart('#' + container);
			
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
			var chart = dc.barChart('#' + container);
			
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

			chart.on('pretransition', function (chart) {

				chart.selectAll("g rect").style("fill", function (d) {
					return 'green';
				});
			});

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

		//http://www.statisticshowto.com/what-is-the-correlation-coefficient-formula/
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
			var chart = dc.numberDisplay('#' + container);

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
			var chart = dc.scatterPlot('#' + container);

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

		var color_gen = function(value){

			if (!value || value > 1 || value < 0)
				return 'gray';

			//multiply by 1000
			//'value' is [0..1]
			//with 4 digits after the dot
			var digit = value*10000;

			//modulo 256 to get 
			//a digit [0..255]
			var mod = digit%256;

			//get the digits of mod
			//144 --> [1, 4, 4]
			//we know that mod is [0..255]
			var hundreds = Math.trunc(mod/100);
			var tens = Math.trunc((mod - hundreds*100)/10);
			var ones = Math.trunc(mod - hundreds*100 - tens*10);
			var digits = [hundreds, tens, ones];

			//calc min and max
			var min = 10;
			for (var i=0; i<3; i++){
				if (digits[i] < min)
					min = digits[i];
			}
			var max = -1;
			for (var i=0; i<3; i++){
				if (digits[i] > max)
					max = digits[i];
			}

			//generate a color
			var rgb = new Array(3);
			for (var i=0; i<3; i++){

				//max
				if (digits[i] === max){

					rgb[i] = mod;
					continue;
				}

				//min
				if (digits[i] === min){

					rgb[i] = Math.trunc(mod/4);
					continue;
				}

				//middle
				rgb[i] = Math.trunc(mod/2);
			}

			//compose a hex color
			var color = '#' + rgb[0].toString(16) + '' +  rgb[1].toString(16) + '' + rgb[2].toString(16);

			return color;
			// console.log('color:' + color + ', rgb:' + rgb + ', max: ' + max + ', min: ' + min + ', hundreds: ' + hundreds + ', tens: ' + tens + ', ones: ' + ones + ', mod: ' + mod + ', digit: ' + digit + ', value: ' + value);
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

			console.log('DC.js load');

			//check if all the libraries
			//are imported
			if (typeof crossfilter === 'undefined'){

				err_callback(new Error('Crossfilter.js is missing'));
				return;
			}
			if (typeof d3 === 'undefined'){

				err_callback(new Error('D3.js is missing'));
				return;
			}
			if (typeof dc === 'undefined'){

				err_callback(new Error('DC.js is missing'));
				return;
			}

			//all good
			dataset = data;
			ndx = crossfilter(dataset);
			err_callback(null);
		}

		this.counter = function(container){

			var chart = dc.numberDisplay('#' + container);

			chart.group(ndx.groupAll())
			.formatNumber(d3.format('g'))
			.valueAccessor(function(d){return d;});

			return chart;
		}

		this.traceOne = function(chart_type, container, key1, key2, ts_key){

			//render the counter
			this.counter('counter').render();

			//return chart
			return ChartsEnum[chart_type].call(this, container, key1, key2, ts_key);
		}

		this.type = 'dc';

	});