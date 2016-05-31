var tsproc = require('tsproc');
//var moment = require('moment');

//connectors
var mongo_connector = require('../connectors/MongoConnector');
var mysql_connector = require('../connectors/MysqlConnector');
var ConnectorsEnum = {
	
					'mongo': mongo_connector,
					'mysql': mysql_connector
					};

//stats config
var stats = {};
stats.homogen = '?';
stats.size = '?';
stats.per_day = '?';
stats.from = '';
stats.to = '';

var TS = {};

//returns the data
TS.getTimeseries = function(req, res){
	
	//get the requested dataset
	var fields_config = req.body;

	//fields_config is an array of size 3
	//0 - config file
	//1 - timestamp fields
	//2 - other fields
	if(fields_config.length){

		//regroup the field from the same source
		var new_fields_config = regroupFields.call(this, fields_config);


		//options config
		var options = fields_config[0];

		if(!new_fields_config){

			res.status(500).send('Some field(s) are missing the timestamp');
			return;
		}

		//load all the data
		//from the specified sources
		var n = new_fields_config.length;
		var promises = new Array(n);
		for (var i=0; i<n; i++){

			promises[i] = new Promise(function(resolve, reject){

				ConnectorsEnum[new_fields_config[i].source.type].getDataset(new_fields_config[i], function(error, dataset){

					if (dataset) resolve(dataset);
					if (error) reject(error);
				});
			});
		}

		//process the data
		Promise.all(promises)
		.then(function(datasets){

			//callback
			var callback = function(err, data){

				if (err) res.status(500).send(err.message);
				if (data) res.json(data);
			}

			//parse a config for tsproc
			//options
			var tsproc_config = {};
			var tmp;
			tsproc_config.transform = options.transform;
			tsproc_config.reduction = options.reduction;
			tsproc_config.date_borders = options.date_borders;

			// //fields
			tsproc_config.timeseries = [];
			new_fields_config.forEach(function(config, index, array){

				tmp = {};
				tmp.fields = [];
				config.fields.forEach(function(field, ind){

					if (field.format){

						tmp.timestamp = field;
					}
					else{

						tmp.fields.push(field);
					}

				});

				tsproc_config.timeseries.push(tmp);
			});

			//instantiate the timeseries processor
			var tsp = new tsproc(datasets, tsproc_config, callback);
			
			//generate a stats json
			//check the homgenity before the processing
			//(after the processing timeseries becomes homogeneous)
			//precutting to assure that the homogen value is accurate
			tsp.cut([tsproc_config.date_borders.from.date, tsproc_config.date_borders.to.date]);
			stats.homogen = tsp.isHomogeneous(); //check the 

			//process the timseries
			tsp.process(callback);

			//get the other stats
			var borders = tsp.getDateBorders();
			stats.from = borders[0];
			stats.to = borders[1];
			stats.size = tsp.getTSSize();
			stats.per_day = tsp.getAvgPerDay();
		})
		.catch(function(error){

			res.status(500).send(error.message);	
		});
	}
}

//returns the stats
//that were generated in the getTimeseries() function
TS.getStats = function(req, res){
	
	res.json([stats]);
}

function regroupFields(configs){

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
	if (count_fields != m){

		return null;
	}

	return new_configs;
}

module.exports = TS;