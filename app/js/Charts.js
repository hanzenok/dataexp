//dataset & crossfilter
var dataset;
var ndx;

var NEGLIGEBLE_NUMBER = 1e-6;

//exported object
var charts={};

//load data into crossfilter
charts.load = function(data){
	
	dataset = data;
	ndx = crossfilter(dataset);
	console.log('loaded!');
};

/**
##Pie Chart
Traces a pie chart.

Example: 
	var pie_chart = graphs.pieChart('type', '#pie-chart');
	var pie_chart = graphs.pieChart('type', '#pie-chart', 'total');
**/
charts.pieChart = function(container, key1, key2){
	
	//dimension
	var dim = ndx.dimension(function(d){return d[key1];}); //+d for number representation of an object
	
	//grouping
	var group = (key2 === undefined) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

	//chart
	var chart = dc.pieChart(container);

	//default values
	chart.width(200).height(200)
	.dimension(dim).group(group)
	.innerRadius(20).radius(100);

	//on hover text
	if (key2 === undefined){
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

/**
##Bar Chart
Traces a histogram. Abscissa can be linear(numbers) or ordinal(strings).

Example: 
	var bar_chart = graphs.barChart('type', '#bar-chart');
	var bar_chart = graphs.barChart('type', '#bar-chart', 'total');
**/
charts.barChart = function(container, key1, key2){
	
	//dimension
	var dim = ndx.dimension(function(d){return d[key1];});
	
	//grouping
	var group = (key2 === undefined) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

	//a fake group that drops number lt NEGLIGEBLE_NUMBER to zero
	//to resolve a floating point problem
	var filtered_group = snap_to_zero(group);	

	//chart
	var chart = dc.barChart(container);
	
	//default values
	chart.width(400).height(200)
	.dimension(dim).group(filtered_group)
	.renderHorizontalGridLines(true)
	.renderVerticalGridLines(true)
	.elasticY(true).xAxisLabel(key1)
	.yAxis().tickFormat(d3.format('s'))
	.margins({top: 10, right: 50, bottom: 30, left: 50});

	//get the type of key
	var key_type = typeof(dataset[0][key1]);
	
	//ordinal abcissa	
	if(key_type == 'string'){
		//ordinal scale
		chart.x(d3.scale.ordinal().domain(dim))
		.xUnits(dc.units.ordinal);
	}
	//linear abcissa
	else{
		//min, max
		var min_val={}, max_val={};
		min_val = dim.bottom(1)[0][key1];
		max_val = dim.top(1)[0][key1];

		//linear scale
		chart.x(d3.scale.linear().domain([min_val - 0.05*max_val, 1.05*max_val]));
	}

	//on hover text and axis labels
	if (key2 === undefined){
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

/**
##Row Chart
Traces a horizontal bars. Empry group excluded.

Example: 
	var row_chart = graphs.rowChart('type', '#row-chart');
	var row_chart = graphs.rowChart('type', '#row-chart', 'total');
**/
charts.rowChart = function(container, key1, key2){

	//dimension
	var dim = ndx.dimension(function(d){return d[key1];});
	
	//grouping
	var group = (key2 === undefined) ? dim.group() : dim.group().reduceSum(function(d) {return d[key2];});

	//chart
	var chart = dc.rowChart(container);
	
	//default values
	chart.width(400).height(200)
	.elasticX(true)
	.dimension(dim).group(group)
	.xAxis().tickFormat(d3.format('s'))
	.margins({top: 10, right: 50, bottom: 30, left: 50});

	//on hover text and axis labels
	if (key2 === undefined){
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

/**
##Time Line
Traces a timestamp.

Example:
	var time_line = graphs.timeLine('#time-line', 'date', '%Y-%m-%dT%H:%M:%SZ', , '%H:%M', 'quantity');

d3 date formats: 
	https://github.com/mbostock/d3/wiki/Time-Formatting

@date_format - format of date in dataset
@axis_date_format - format of date on x axis
**/
charts.timeLine = function(container, date_key, date_format, axis_date_format, key){
	
	//parse time format
	var parse_date = d3.time.format(date_format).parse;
	dataset.forEach(function(d){
		
		d[date_key] = parse_date(String(d[date_key]));
		//d[date_key].setDate(1);
		//console.log(d[date_key]);
	});

	//dimension
	var dim = ndx.dimension(function(d){return d[date_key]});
	
	//grouping
	var group = (key === undefined) ? dim.group() : dim.group().reduceSum(function(d) {return d[key];});	
	
	//min,max
	var min_val={}, max_val={};
	min_val = dim.bottom(1)[0][date_key];
	max_val = dim.top(1)[0][date_key];
	
	//chart
	var chart = dc.lineChart(container);

	//default values
	chart.width(800).height(200)
	.dimension(dim).group(group)
	.x(d3.time.scale().domain([min_val, max_val]))
	.renderArea(true).elasticY(true)
	.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
	.margins({top: 10, right: 50, bottom: 30, left: 50})
	.xAxis().ticks(5).tickFormat(d3.time.format(axis_date_format));
	
	if(key === undefined){
		chart.yAxisLabel('#');		
	}
	else{
		chart.yAxisLabel(key);
	}

return chart;
}

/**
##Counter
Executes reduce operation

Example without reduce (counts number of instances in dataset):
	var nb_counter = graphs.counter('#number-counter');

Example with reduce function:
	var reduce_function = function(d){return d.total + d.tip;};
	var nb_counter = graphs.counter('#number-counter', reduce_function);

d3 formats: https://github.com/mbostock/d3/wiki/Formatting

Example: http://dc-js.github.io/dc.js/examples/number.html
**/
charts.counter = function(container, freduce){
	
	//chart
	var chart = dc.numberDisplay(container);
	
	//default values
	chart.formatNumber(d3.format('.4s'))
	.valueAccessor(function(d){return d;});
	
	//reduce function
	if (freduce === undefined){
		chart.group(ndx.groupAll());
	}
	else {	
		chart.group(ndx.groupAll().reduceSum(freduce));
	}
}

/**
##Average
Caclulates an average value

Example:
	var avg_counter = graphs.average('#avg-counter', 'total');

Reduce functions:
	http://stackoverflow.com/questions/21519856/dc-js-how-to-get-the-average-of-a-column-in-data-set
**/
charts.average = function(container, key){

	//reduce functions	
	var freduceAdd = function(p, v){
		++p.count;
		p.sum += v[key];
		return p;
	};

	var freduceRemove = function(p, v){
		--p.count;
		p.sum -= v[key];
		return p;
	};

	var freduceInitial = function(){
		return {count: 0, sum: 0};
	}

	//dimension
	var dim = ndx.groupAll().reduce(freduceAdd, freduceRemove, freduceInitial);

	//chart
	var chart = dc.numberDisplay(container);

	//default values
	chart.formatNumber(d3.format(".4s"))
	.group(dim)
	.valueAccessor(function(p){return p.count > 0 ? p.sum / p.count : 0;});
}

charts.scatterPlot = function(container, key1, key2){

	//dimensions
	var dim = ndx.dimension(function(d){return [+d[key1], +d[key2]];});

	//grouping
	var group = dim.group();

	//chart
	var chart = dc.scatterPlot(container);

	//default values
	chart.width(400).height(200)
	.dimension(dim).group(group)
	.x(d3.scale.linear().domain([]))
	.elasticX(true).elasticY(true)
	.margins({top: 10, right: 50, bottom: 30, left: 50})
	.xAxisLabel(key1).yAxisLabel(key2);

return chart;
}

//http://www.statisticshowto.com/what-is-the-correlation-coefficient-formula/
charts.correlation = function(container, key1, key2){
	
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
}

/**
##Snap To Zero
Prevents floating point errors
**/
function snap_to_zero(source_group) {
    return {
        all:function () {
            return source_group.all().map(function(d) {
                return {key: d.key, 
                        value: (Math.abs(d.value)<NEGLIGEBLE_NUMBER) ? 0 : d.value};
            });
        }
    };
}

module.exports = charts;