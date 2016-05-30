var underscore = require('underscore');

var ModifyConfig = {};

//returns a promise
//config is an array of three elements
//first - config file
//second - config of timestamp fields
//third - other fields
// [ 
// {
// "transform":{"type":"interp", "interp_type":"linear"},
// "reduction":{"type":"skip", "size": 1},
// "date_borders":
// 	{
// 		"from":{"date": "Thu Jan 28 1993 00:00:00 GMT+0100 (CET)"},
// 		"to":{"date": "Wed Jan 29 1993 00:00:00 GMT+0100 (CET)"}
// 	}
// },
// [ { field: {name: 'year', format: 'YYYY'},
//       store: 'colorado_river',
//       source: [Object],
//       format: 'YYYY' },
//     { field: {name: 'month', format: 'YYYY-MM'},
//       store: 'eastport_river',
//       source: [Object],
//       format: 'YYYY-MM-DD' } ],
//   [ { field: {name: 'flows_colorado'},
//       store: 'colorado_river',
//       source: [Object] },
//     { field: {name: 'precip'}, 
//       store: 'eastport_river', 
//       source: [Object] } ] 
// ]
ModifyConfig.regroupFields = function(configs){

	var timestamps = configs[1];
	var fields = configs[2];
	var n = timestamps.length;	
	var m = fields.length;

	var new_configs = new Array(n);
	var tmp;

	//prepare the timestamp fields
	timestamps.forEach(function(timestamp_config, index){

		tmp = {};
		tmp.fields = [];

		//copy the timestamp
		tmp.fields.push(timestamp_config.field);

		//and other info
		tmp.store = timestamp_config.store;
		tmp.source = timestamp_config.source;

		//add to the new config
		new_configs[index] = tmp;
	});


	//regroup the other fields
	var count_fields = 0;
	for (var i=0; i<n; i++){

		for (var j=0; j<m; j++){

			if (new_configs[i].source.name === fields[j].source.name &&
				new_configs[i].store.name === fields[j].store.name){

				new_configs[i].fields.push(fields[j].field);
				count_fields++;
			}
		}
	}

	//check if all fields were assciated
	//with a timestamp field:
	console.log(count_fields);
	if (count_fields != m){

		return null;
	}

	return new_configs;
}

module.exports = ModifyConfig;