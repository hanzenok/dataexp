var tsproc = require('tsproc');
var modifyConfig = require('./../ModifyConfig');
var moment = require('moment');

var mongo_connector = require('../connectors/MongoConnector');
var ConnectorsEnum = {'mongo': mongo_connector};

var date_borders = [moment.utc('1926-05', 'YYYY-MM').toISOString(), moment.utc('1930', 'YYYY').toISOString()];

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

			tsp = new tsproc(datasets, tsproc_config, callback);
			tsp.process(date_borders, callback);

			console.log('is homogen:');
			console.log(tsp.isHomogeneous());
			console.log('size:');
			console.log(tsp.getTSSize());
			console.log('avg per day:');
			console.log(tsp.getAvgPerDay());

		})
		.catch(function(error){

			res.status(500).send(error.message);	
		});
	}
}


module.exports = getDataset;