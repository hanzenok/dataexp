var tsproc = require('tsproc');
var modifyConfig = require('./../ModifyConfig');
var moment = require('moment');

var mongo_connector = require('../connectors/MongoConnector');
var ConnectorsEnum = {'mongo': mongo_connector};

var date_borders = [moment.utc('1925', 'YYYY').toISOString(), moment.utc('1935', 'YYYY').toISOString()];

var getDataset = function(req, res){
	
	//get the requested dataset
	var fields_config = req.body;

	if(fields_config.length){

		//fuse configs into one
		//determine the timestamp fields
		var new_config = modifyConfig(fields_config);
		if(!new_config){

			res.status(500).send('Some field(s) are missing the timestamp');
			return;
		}

		//load all the data
		//from the specified sources
		var n = new_config.length;
		var promises = new Array(n);
		for (var i=0; i<n; i++){

			promises[i] = new Promise(function(resolve, reject){

				ConnectorsEnum[new_config[i].source.type].getDataset(new_config[i], function(error, dataset){

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

			//parse new config for ts proc
			var tsproc_config = {};
			tsproc_config.timeseries = [];
			new_config.forEach(function(config, index, array){

				tsproc_config.timeseries.push(config);
			});

			//instantiate the timeseries processor
			tsp = new tsproc(datasets, tsproc_config, callback);
			
			//generate a stats json
			//check the homgenity before the processing
			//(after the processing timeseries becomes homogeneous)
			var stats = {};
			stats.homogen = tsp.isHomogeneous(); //check the 

			//process the timseries
			tsp.process(date_borders, callback);

			//get the other stats
			stats.size = tsp.getTSSize();
			stats.per_day = tsp.getAvgPerDay();

			console.log(stats);

		})
		.catch(function(error){

			res.status(500).send(error.message);	
		});
	}
}


module.exports = getDataset;