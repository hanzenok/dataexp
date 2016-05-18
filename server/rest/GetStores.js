var fs = require('fs');
var mongoose = require('mongoose');

var mongo_connector = require('../connectors/MongoConnector');
var ConnectorsEnum = {'mongo': mongo_connector};

var config_file = './server/config/sources.json';

//return the config file with all the stores
//of sources specified in the sources config file
var getStores = function(req, res){

	//get the requested sources
	var sources_conf = req.body;

	if (sources_conf.length){

		var n = sources_conf.length;
		var promises = new Array(n);

		//load the stoars of each source
		for(i=0; i<n; i++){

			promises[i] = new Promise(function(resolve, reject){

				ConnectorsEnum[sources_conf[i].type].getStores(sources_conf[i], function(error, stores){

					if (stores) resolve(stores);
					if (error) reject(error);
				});
			});
			
		}

		//wait for all the stores
		Promise.all(promises)
		.then(function(stores_per_source){

			//recompact the stores
			//leave only wanted stores
			var stores = [];
			stores_per_source.forEach(function(source, index){

				source.forEach(function(store, index){

					stores.push(store);
				});
			});

			//send the response
			res.json(stores);
		})
		.catch(function(error){

			res.status(500).send(error.message);	
		});
	}
}

module.exports = getStores;
