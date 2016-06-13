angular.module('MainApp')
	.service('ChartsService', function(vkThread){
		
		//data containers
		var dataset;
		var ndx;

		var pie_chart = function(container, key1, key2, ts_key){

			console.log(ndx);

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
	
			var t0 = performance.now();

			var day_parser = d3.time.format('%Y-%m-%d').parse;

			//parse time format
			dataset.forEach(function(doc){
				
				doc[ts_key] = new Date(doc[ts_key]);
				doc.day = day_parser(doc[ts_key].getFullYear() + '-' + (doc[ts_key].getMonth()+1) + '-' +  doc[ts_key].getDate());
			});

			var t2 = performance.now();
			console.log("After the parsing " + (t2 - t0) + " ms");

			//dimensions
			var dim = ndx.dimension(function(d){return d[ts_key]});
			var dim_days = ndx.dimension(function(d){return d.day;});
			
			//grouping
			var group_days = dim_days.group();
			var group1 = dim.group().reduceSum(function(d) {return d[key1];});
			var group2 = (key2) ? dim.group().reduceSum(function(d){return d[key2];}) : null;
			
			//min,max
			var min_val={}, max_val={};
			min_val = dim.bottom(1)[0][ts_key];
			max_val = dim.top(1)[0][ts_key];
			
			//charts
			var composite_chart = dc.compositeChart(container);
			var line_chart1 = dc.lineChart(composite_chart);
			var line_chart2 = dc.lineChart(composite_chart);
			var bar_chart = dc.barChart(container + '_bar');

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

			//scroll bar_chart
			bar_chart.width(800).height(75)
			.dimension(dim_days).group(group_days)
			.x(d3.time.scale().domain([min_val, max_val]))
			.margins({top: 20, right: 50, bottom: 20, left: 50});
			bar_chart.yAxis().ticks(0);
			bar_chart.xUnits(d3.time.hours);
			bar_chart.render();

			// console.log(composite_chart);

			// var vk = vkThread();
			// var func = function(chart){console.log(eval(chart));
			// 	eval(chart).render();}
			// var param = {
			// 		fn:func,
			// 		args: [composite_chart]
			// };
			// vk.exec(param).then(function(data){
			// 	console.log('yep');
			// });

			// var t2 = performance.now();
			// console.log("Before render " + (t2 - t0) + " ms");

			// //composite_chart.render();

			// var t3 = performance.now();
			// console.log("After render " + (t3 - t0) + " ms");

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

			// var vk = vkThread();
			// var param = {
			// 		fn:pie_chart,
			// 		args: [container, key1, key2, ts_key, ndx, dc]
			// };
			// vk.exec(param).then(function(data){
			// 	console.log('yep');
			// });


			// var vk = vkThread();
			// function test(func, container, key1, key2, ts_key, dc, ndx, dataset){
			// 	console.log('vkthread:');
			// 	func.call(this, container, key1, key2, ts_key, dc, ndx, dataset);
			// 	return 3;
			// }
			// var param = {
			// 	fn: test,
			// 	args: [ChartsEnum[chart_type], container, key1, key2, ts_key, dc, this._ndx, this._dataset]
			// };
			// vk.exec(param).then(function(data){
			// 	console.log(data);
			// });

// '			var worker_func = function(file){
// 				console.log('TypeOf DC.js: ');
// 				console.log(file);
// 			};
// 			var worker = Webworker.create(worker_func);
// 			var file = {a: dc};
// 			worker.run(file);'


			// var worker = Webworker.create(ChartsEnum[chart_type]);
			// worker.run(chart_type, container, key1, key2, ts_key, _ndx, _dataset)
			// 	.then(function(chart){
			// 		chart.render();
			// 	});

			// var worker = Webworker.create(ChartsEnum[chart_type]);
			// worker.run(container, key1, key2, ts_key, _ndx, _dataset);

		}

	});