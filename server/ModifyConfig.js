var underscore = require('underscore');

//returns a promise
//config is an array of two elements
//first - config of timestamp fields
//second - other fields
// [ [ { name: 'year',
//       store: 'colorado_river',
//       source: [Object],
//       format: 'YYYY' },
//     { name: 'month',
//       store: 'eastport_river',
//       source: [Object],
//       format: 'YYYY-MM-DD' } ],
//   [ { name: 'flows_colorado',
//       store: 'colorado_river',
//       source: [Object] },
//     { name: 'precip', 
//       store: 'eastport_river', 
//       source: [Object] } ] 
// ]
function ModifyConfig(config){

	//first get all the timestamps
	var new_config = config[0];
	var n = new_config.length;
	for (var i=0; i<n; i++){

		//add timstamp field to config
		new_config[i].timestamp = {};
		new_config[i].timestamp.field = new_config[i].name;
		new_config[i].timestamp.format = new_config[i].format;

		//delete because copied
		delete new_config[i].name;
		delete new_config[i].format;

		//description of normal fields
		new_config[i].fields = [];
	}

	//regroupe the other fields
	var fields_config = config[1];
	var m = fields_config.length;
	var fields_count = 0;
	for (var i=0; i<m; i++){

		for (var j=0; j<n; j++){

			if (fields_config[i].store === new_config[j].store &&
				fields_config[i].source.server === new_config[j].source.server &&
				fields_config[i].source.db === new_config[j].source.db ){

				new_config[j].fields.push({'field': fields_config[j].name});
				fields_count ++;
			}
		}
	}

	//check if all fields were assciated
	//with a timestamp field:
	console.log(fields_count + ': ' + m);
	if(fields_count !== m)
		return null;

	return new_config;
}

module.exports = ModifyConfig;