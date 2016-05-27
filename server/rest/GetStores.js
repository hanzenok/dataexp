var mongoose = require('mongoose');

var mongo_connector = require('../connectors/MongoConnector');
var ConnectorsEnum = {'mongo': mongo_connector};

var config_file = './server/config/sources.json';

//return the config file with all the stores
//of sources specified in the sources config file
var getStores = function(req, res){

	//get the requested sources
	var sources_conf = req.body;
	var n = sources_conf.length;

	if (n){

		var store_promises = new Array(n);

		//load the stoars of each source
		for(i=0; i<n; i++){

			store_promises[i] = new Promise(function(resolve, reject){

				ConnectorsEnum[sources_conf[i].source.type].getStoreNames(sources_conf[i], function(error, stores){

					if (stores) resolve(stores);
					if (error) reject(error);
				});
			});
			
		}

		//wait for all the stores
		//and pack them into the array
		Promise.all(store_promises)
		.then(function(stores_per_source){

			//recompact the stores
			var stores = [];
			stores_per_source.forEach(function(source, index){

				source.forEach(function(store, index){

					stores.push(store);
				});
			});

			//get the sizes of each store
			var size_promises = new Array(stores.length);
			stores.forEach(function(store_conf, index){

				size_promises[index] = new Promise(function(resolve, reject){

					ConnectorsEnum[store_conf.source.type].getStoreSize(store_conf, function(err, size){

						if (size) resolve(size);
						if (err) reject(err);
					});
				});

			});

			Promise.all(size_promises)
			.then(function(stores_with_sizes){

				res.json(stores_with_sizes);
			})
			.catch(function(error){

				res.status(500).send(error.message);
			});
		})
		.catch(function(error){
			
			res.status(500).send(error.message);	
		});
	}
}

module.exports = getStores;
