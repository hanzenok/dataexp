var tsproc = require('tsproc');
var modifyConfig = require('./../ModifyConfig');
//var moment = require('moment');

//connectors
var mongo_connector = require('../connectors/MongoConnector');
var ConnectorsEnum = {'mongo': mongo_connector};

// var date_borders = [moment.utc('1925', 'YYYY').toISOString(), moment.utc('1935', 'YYYY').toISOString()];

//stats config
var stats = {};
stats.homogen = '?';
stats.size = '?';
stats.per_day = '?';

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

		//fuse field config and timestamp field config into one config
		//determine the timestamp fields
		var new_fields_config = modifyConfig(fields_config);

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
			tsproc_config.transform = options.transform;
			tsproc_config.reduction = options.reduction;
			tsproc_config.date_borders = options.date_borders;

			//fields
			tsproc_config.timeseries = [];
			new_fields_config.forEach(function(config, index, array){

				tsproc_config.timeseries.push(config);
			});

			//instantiate the timeseries processor
			var tsp = new tsproc(datasets, tsproc_config, callback);
			
			//generate a stats json
			//check the homgenity before the processing
			//(after the processing timeseries becomes homogeneous)
			stats.homogen = tsp.isHomogeneous(); //check the 

			//process the timseries
			tsp.process(callback);

			//get the other stats
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

module.exports = TS;