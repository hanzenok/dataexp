var fs = require('fs');
var mongoose = require('mongoose');

var mongo_connector = require('../connectors/MongoConnector');
var ConnectorsEnum = {'mongo': mongo_connector};

var config_file = './server/config/sources.json';


var getStores = function(req, res){

	//read the sources config file
	fs.readFile(config_file, function(err, data){

		if (err) {

			res.status(500).send('Error reading config file');
			return;
		}
		else {

			var configs = JSON.parse(data);
			var n = configs.length;
			var promises = new Array(n);


			//load the stoars of each source
			for(i=0; i<n; i++){

				promises[i] = new Promise(function(resolve, reject){

					ConnectorsEnum['mongo'].getStores(configs[i], function(error, stores){

						if (stores) resolve(stores);
						if (error) reject(error);
					});
				});
				
			}

			//wait for all the stores
			Promise.all(promises)
			.then(function(stores_per_source){

				//recompact the stores
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
				console.log(error);
				res.status(500).send(error);	
			});
		}
	});
}

module.exports = getStores;
