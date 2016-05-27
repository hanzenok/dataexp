var mongoose = require('mongoose');

var MongoConnector = {};

MongoConnector.getStoreNames = function(source_config, callback){

	//check the source config
	if (!isValidSourceConfig(source_config)){

		if (callback) 
			callback(new Error('Invalid source config file'));

		return;
	}
	
	//connection to mongo
	var user_and_pass = (source_config.source.user && source_config.source.passw) ? source_config.source.user + ':' + source_config.source.passw + '@' : '';
	var url = 'mongodb://' + user_and_pass + source_config.source.server + ':' + source_config.source.port + '/' + source_config.source.db;
	var connection = mongoose.createConnection(url);

	connection.once('open', function(){

		//get the liste of all the collections(stores) of the database
		connection.db.listCollections().toArray(function(err, items){

			if (err) {
				callback(new Error('Cannot list the stores'));
			}
			else {
				connection.close();

				//pack the collection(store) names
				var tmp = {};
				var stores = [];
				items.forEach(function(item, index, array){

					if (item.name.indexOf('system.') === -1){

						tmp.store = {};
						tmp.store.name = item.name;
						tmp.source = source_config.source;
						stores.push(tmp);

						tmp = {};
					}
				});

				//call the callback
				if (stores.length){

					callback(null, stores);
				}
				else{
					callback(new Error('Cannot list the stores'));
				}
			}
		});
	});

	connection.on('error', function(error){

		if (callback)
			callback(new Error('Cannot connect to the mongo database ' + source_config.source.db + ' from ' + source_config.source.server + ' server'));
	});

}

MongoConnector.getStoreSize = function(store_config, callback){

	if (!isValidStoreConfig.call(this, store_config)){

		if (callback) 
			callback(new Error('Invalid store config'));

		return;
	}

	//connection to mongo
	var user_and_pass = (store_config.source.user && store_config.source.passw) ? store_config.source.user + ':' + store_config.source.passw + '@' : '';
	var url = 'mongodb://' + user_and_pass + store_config.source.server + ':' + store_config.source.port + '/' + store_config.source.db;
	var connection = mongoose.createConnection(url);
	var model = connection.model('', {}, store_config.store.name);

	//counting
	model.count({}, function(err, count){

		if (err) callback(new Error('Cannot get the store size'));
		if (count) {

			store_config.store.size = count;
			callback(null, store_config);
		}
	});
}

//get all the fields of a store
MongoConnector.getFields = function(store_config, callback){

	//check the store config
	if (!isValidStoreConfig.call(this, store_config)){

		if (callback) 
			callback(new Error('Invalid store config'));

		return;
	}

	//connection to mongo
	var user_and_pass = (store_config.source.user && store_config.source.passw) ? store_config.source.user + ':' + store_config.source.passw + '@' : '';
	var url = 'mongodb://' + user_and_pass + store_config.source.server + ':' + store_config.source.port + '/' + store_config.source.db;
	var connection = mongoose.createConnection(url);
	var model = connection.model('', {}, store_config.store.name);
	var doc, fields;
	var tmp;

	//find the first document
	//we suppose that it's fields are the same for all
	//the documents in the collection
	model.findOne({}, function(err, document){

		if (err){

			callback(new Error('Cannot load the field'));
		}
		else {

			//delete all the javascript fields
			doc = JSON.parse(JSON.stringify(document));

			//parse the fields
			fields = [];
			for(var key in doc){

				if (key !== '_id'){

					//field
					tmp = {};
					tmp.field = {};
					tmp.field.name = key;

					//value
					tmp.field.value = doc[key];

					//copy store config
					tmp.store = store_config.store;
					tmp.source = store_config.source;

					fields.push(tmp);
				}
			}

			connection.close();
			if(callback)
				callback(null, fields);
		}
	});
}

MongoConnector.getDataset = function(dataset_config, callback){

	//check the field config
	if (!isValidDatasetConfig.call(this, dataset_config)){

		if (callback) 
			callback(new Error('Invalid dataset config'));

		return;
	}

	//connection to mongo
	var user_and_pass = (dataset_config.source.user && dataset_config.source.passw) ? dataset_config.source.user + ':' + dataset_config.source.passw + '@' : '';
	var url = 'mongodb://' + user_and_pass +  dataset_config.source.server + ':' + dataset_config.source.port + '/' + dataset_config.source.db;
	var connection = mongoose.createConnection(url);
	var model = connection.model('', {}, dataset_config.store.name);
	
	//document fields to load
	var fields = {};
	fields['_id'] = 0; //do not include id field
	fields[dataset_config.timestamp.field] = 1; //include timestamp field
	dataset_config.fields.forEach(function(config, index){

		fields[config.field] = 1;
	});

	//launch query
	model.aggregate([{$project: fields}],
		function(err, result){
			if (err) {
				callback(err);
			}
			else {
				callback(null, result);
			}
	});
}

function isValidSourceConfig(source_config){

	if (!source_config || typeof source_config !== 'object') 
		return false;

	if (!source_config.source)
		return false;

	if (!source_config.source.type || !source_config.source.server || !source_config.source.db)
		return false;

	return true;
}

function isValidStoreConfig(store_config){

	if (!isValidSourceConfig(store_config))
		return false;

	if (!store_config.store)
		return false;

	if (!store_config.store.name)
		return false;

	return true;
}

function isValidDatasetConfig(dataset_config){

	if (!isValidStoreConfig(dataset_config))
		return false;

	if (!dataset_config.fields || !dataset_config.timestamp)
		return false;

	return true;
}

module.exports = MongoConnector;