/**
 * Angualr.js services.
 * @module client
 * @submodule Services
 */

/**
 * A service that wraps 
 * a DC.js charting library and 
 * offers two public methods:
 * - <b>load()</b>: loads the data (json array)
 * that should be visualysed
 * - <b>getChart()</b>: returns the chart
 * filled with the data from the <b>load()</b> function.
 * The chart can be then traced by calling <i>render()</i>
 * function on it.
 * @class DCChartsService
 */
angular.module('MainApp')
	.service('DCChartsService', function(){
		
		/**
		* @property dataset
		* @type array
		* @description A local variable
		* that holds the loaded dataset.
		*/
		var dataset;

		/**
		* @property ndx
		* @type object
		* @description A crossfilter
		* object.
		*/
		var ndx;

		/**
		* A private method that returns a 
		* DC.js pie chart.
		* Can work with two fieds.
		* @method pie_chart
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @param {string} key2 A second key that should be visualised
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		var pie_chart = function(container, key1, key2){

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

		/**
		* A private method that returns a 
		* DC.js timeline.
		* Can work with two fields.
		* @method timeline
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @param {string} key2 A second key that should be visualised 
		* @param {string} ts_key A timestamp key
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		var timeline = function(container, key1, key2, ts_key){

			//check if correlation field is present
			if (typeof dataset[0].correlation !== 'undefined'){

				//parse time format and correlation
				dataset.forEach(function(doc){
					
					doc[ts_key] = new Date(doc[ts_key]);

					if (!doc.correlation)
						doc.correlation = 0.1;
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
			var group1 = dim.group().reduceSum(function(d) {return +d[key1];});
			var group2 = (key2) ? dim.group().reduceSum(function(d){return +d[key2];}) : null;
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

			//coloring
			bar_chart.on('pretransition', function (chart) {

				chart.selectAll('g rect').style('fill', function (d) {
					if (d.data && d.data.value >= 0.6){

						return '#' + color_gen.call(this, d.data.value);
					}
					else{
						return 'gray';
					}
				});
			});

			/*=====Left because it could be useful=====*/
		    // bar_chart.on('renderlet', function (chart) {
		    //     chart.selectAll("circle.dot")
		    //         .style("fill-opacity", 1)
		    //         .on('mousemove', null)
		    //         .on('mouseout', null);
		    //     chart.selectAll("path.line")
		    //          .style("stroke", function(d){
		    //             console.log(d); 
		    //             return "green";
		    //      });
		    // });

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

		/**
		* A private method that returns a 
		* DC.js row chart.
		* Can work with two fields.
		* @method row_chart
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @param {string} key2 A second key that should be visualised
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
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

		/**
		* A private method that returns a 
		* DC.js bar chart.
		* Can work with two fields, and also 
		* with a timestamp field.
		* @method bar_chart
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @param {string} key2 A second key that should be visualised
		* @param {string} ts_key A timestamp key
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		var bar_chart = function(container, key1, key2, ts_key){

			var pkey = key1; //primary key
			var skey = key2; //secondary key

			//timestamp field could be passes
			//as key1 or key2
			//so assure that it would always be pkey
			if (skey === ts_key){

				skey = pkey;
				pkey = ts_key;
			}

			//parse dates if pkey is a timestamp
			if (pkey === ts_key){

				dataset.forEach(function(doc){
					
					doc[pkey] = new Date(doc[pkey]);
				});
			}

			//dimension
			var dim = ndx.dimension(function(d){return d[pkey];});
			
			//grouping
			var group = (!skey) ? dim.group() : dim.group().reduceSum(function(d) {return +d[skey];});

			//chart
			var chart = dc.barChart('#' + container);
			
			//default values
			chart.width(600).height(319)
			.dimension(dim).group(group)
			.renderHorizontalGridLines(true)
			.renderVerticalGridLines(true)
			.elasticY(true).xAxisLabel(pkey)
			.yAxis().tickFormat(d3.format('s'));
			chart.margins({top: 20, right: 20, bottom: 50, left: 50});

			//x range
			if (pkey === ts_key){

				//min,max
				var min_val={}, max_val={};
				min_val = dim.bottom(1)[0][pkey];
				max_val = dim.top(1)[0][pkey];

				//time scale
				chart.x(d3.time.scale().domain([min_val, max_val]));
			}
			else{

				//ordinal scale
				chart.x(d3.scale.ordinal().domain(dim))
				.xUnits(dc.units.ordinal);
			}

			/*=====Left because it could be useful=====*/
			// chart.on('pretransition', function (chart) {
			// 	chart.selectAll("g rect").style("fill", function (d) {
			// 		return 'green';
			// 	});
			// });

			//on hover text and axis labels
			if (!skey){
				chart.yAxisLabel('#');
			}
			else{
				chart.yAxisLabel(skey);
			}

			return chart;
		}

		/**
		* A private method that is used
		* by <b>scatter</b> method
		* to show the correlation <a href="http://www.statisticshowto.com/what-is-the-correlation-coefficient-formula/"></a>
		* between two attributes
		* @method correlation
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first attribute to calculate the correlation
		* @param {string} key2 A second attribute to calculate the correlation
		* @return A DC.js number chart, that can be rendered by calling the <i>render()</i> function
		*/
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

		/**
		* A private method that returns a 
		* DC.js scatter plot.
		* Only works with two fields.
		* @method scatter
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A x axis
		* @param {string} key2 A y axis
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
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

		/**
		* A local method used by <b>timeline</b> method
		* to color the correlated fields.
		* It is using an algorithm to generate a color 
		* (hexa format, without alpha) from a [0..1] value (cf example).
		* @method color_gen
		* @param {float} value A [0..1] value from which the color should be generated
		* @return {string} A color in hexa format
		* @example
		*     console.log(color_gen.call(this, 0.7338)); //55aa2a
		*     console.log(color_gen.call(this, 0.9321)); //341a69
		*/
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
			var color = rgb[0].toString(16) + '' +  rgb[1].toString(16) + '' + rgb[2].toString(16);

			return color;
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
		* DC.js, D3.js and Crossfilter.js libraries.
		* @method load
		* @param {array} data Data that should be visualised
		* @param {callback} err_callback An error callback
		*/
		this.load = function(data, err_callback){

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

		/**
		* A local method that is used
		* by <b>getChart()</b> method to 
		* render the number of instances
		* in the current filter
		* @method counter
		* @param {array} container An id of a html tag container of the chart
		* @return A number DC.js chart that cab be rendered by calling the <i>render()</i> method
		*/
		var counter = function(container){

			var chart = dc.numberDisplay('#' + container);

			chart.group(ndx.groupAll())
			.formatNumber(d3.format('g'))
			.valueAccessor(function(d){return d;});

			return chart;
		}

		/**
		* A public method that returns a 
		* DC.js chart specified by <code>chart_type</code>
		* @method getChart
		* @param {string} chart_type A type of chart from the <code>ChartsEnum</code>
		* @param {array} container An id of a html tag container of the chart
		* @param {string} key1 A first key that should be visualised
		* @param {string} key2 A second key that should be visualised 
		* @param {string} ts_key A timestamp key
		* @return {chart} A chart that can be rendered by calling the <i>render()</i> method
		*/
		this.getChart = function(chart_type, container, key1, key2, ts_key){

			//render the counter
			counter.call(this,'counter').render();

			//return chart
			return ChartsEnum[chart_type].call(this, container, key1, key2, ts_key);
		}

	});