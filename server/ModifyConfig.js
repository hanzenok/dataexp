var underscore = require('underscore');

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
function ModifyConfig(config){

	//first get all the timestamps
	var new_config = config[1];
	var n = new_config.length;
	for (var i=0; i<n; i++){

		//add timstamp field to config
		new_config[i].timestamp = {};
		new_config[i].timestamp.field = new_config[i].field.name;
		new_config[i].timestamp.format = new_config[i].field.format;

		//delete because copied
		delete new_config[i].field;

		//description of normal fields
		new_config[i].fields = [];
	}

	//regroupe the other fields
	var fields_config = config[2];
	var m = fields_config.length;
	var fields_count = 0;
	for (var i=0; i<m; i++){

		for (var j=0; j<n; j++){

			if (fields_config[i].store.name === new_config[j].store.name &&
				fields_config[i].source.server === new_config[j].source.server &&
				fields_config[i].source.db === new_config[j].source.db){

				new_config[j].fields.push({'field': fields_config[j].field.name});
				fields_count ++;
			}
		}
	}

	//check if all fields were assciated
	//with a timestamp field:
	if (fields_count !== m){

		return null;
	}

	return new_config;
}

module.exports = ModifyConfig;