var mongoose = require('mongoose');

var MongoConnector = {};

MongoConnector.getStores = function(config, callback){

	//check the config
	if (!isValidConfig.call(this, config)){

		if (callback) 
			callback('Invalid config file');

		return;
	}
	
	//connection to mongo
	var url = 'mongodb://' + config.server + ':' + config.port + '/' + config.db;
	var connection = mongoose.createConnection(url);
	connection.once('open', function(){

		//get the liste of all the collections(stores) of the database
		connection.db.listCollections(true).toArray(function(err, items){

			if (err) {
				callback('Cannot list the stores');
			}
			else {
				connection.close();

				//pack the collection(store) names
				var tmp = {};
				var stores = [];
				items.forEach(function(item, index, array){

					if (item.name.indexOf('system.') === -1){

						tmp.store = item.name;
						tmp.source = config;
						stores.push(tmp);

						tmp = {};
					}
				});

				//call the callback
				if (callback)
					callback(null, stores);
			}
		});
	});

	connection.on('error', function(error){

		console.log(error);

		if(callback)
			callback('Cannot connect to the mongo database ' + config.db + ' from ' + config.server + ' server');
	});

}

function isValidConfig(config){

	if (!config || typeof config !== 'object') 
		return false;

	if(!config.type || !config.server || !config.db)
		return false;

	return true;
}

module.exports = MongoConnector;