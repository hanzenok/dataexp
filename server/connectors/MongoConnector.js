var mongoose = require('mongoose');

var MongoConnector = {};

MongoConnector.getStores = function(source_config, callback){

	//check the source config
	if (!isValidSourceConfig.call(this, source_config)){

		if (callback) 
			callback('Invalid source config file');

		return;
	}
	
	//connection to mongo
	var url = 'mongodb://' + source_config.server + ':' + source_config.port + '/' + source_config.db;
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
						tmp.source = source_config;
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

		if (callback)
			callback('Cannot connect to the mongo database ' + source_config.db + ' from ' + source_config.server + ' server');
	});

}

//get all the fields of a store
MongoConnector.getFields = function(store_config, callback){

	//check the sourceconfig
	if (!isValidStoreConfig.call(this, store_config)){

		if (callback) 
			callback('Invalid store config file');

		return;
	}

	//connection to mongo
	var url = 'mongodb://' + store_config.source.server + ':' + store_config.source.port + '/' + store_config.source.db;
	var connection = mongoose.createConnection(url);
	var model = connection.model('', {}, store_config.store);
	var doc, fields;

	//find the first document
	//we suppose that it's fields are the same for all
	//the documents in the collection
	model.findOne({}, function(err, document){

		if (err){

			callback('Cannot load the field');
		}
		else {

			//delete all the javascript fields
			doc = JSON.parse(JSON.stringify(document));

			//parse the fields
			fields = [];
			for(var key in doc){

				if (key !== '_id'){

					fields.push({'field': key});
				}
			}

			connection.close();
			if(callback)
				callback(null, fields);
		}
	});
}

function isValidSourceConfig(source_config){

	if (!source_config || typeof source_config !== 'object') 
		return false;

	if(!source_config.type || !source_config.server || !source_config.db)
		return false;

	return true;
}

function isValidStoreConfig(store_config){

	if (!isValidSourceConfig(store_config.source))
		return false;

	if(!store_config.store)
		return false;

	return true;
}

module.exports = MongoConnector;