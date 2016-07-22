var mongoose = require('mongoose');

/**
 * Connectors to different types of storages.
 * @module server
 * @submodule Connectors
 */

/**
 * A connector to the MongoDB database
 * @class MongoConnector
 */
var MongoConnector = {};

/**
 * A public method that returns the 
 * names of the stores (mongo collections)
 * that are present in the specified by
 * config file database.
 * @method getStoreNames
 * @param {json} source_config Source (mongo database) configuration
 * @param {function} callback Callback function
 * @return {array} An array of stores (mongo collections) configuration
 * 
 * @example
 *     var mongo_connector = require('../connectors/MongoConnector');
 *
 *     //the MongoDB database 'test_database' has the following collections:
 *     //	- collection1
 *     //	- collection2
 *
 *     //config file
 *     var source_config = { 
 *     	source: {
 *     			name: 'test_mongo',
 *     			type: 'mongo',
 *     			user: '',
 *     			passw: '',
 *     			server: 'localhost',
 *     			port: null,
 *     			db: 'test_database'
 *     	} 
 *     };
 *
 *     //requesting the stores
 *     mongo_connnector.getStoreNames(source_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//[ 
 *     		//	{ 
 *     		//		store: {name: 'collection1'},
 *     		//		source: { 
 *     		//			name: 'test_mongo',
 *     		//			type: 'mongo',
 *     		//			user: '',
 *     		//			passw: '',
 *     		//			server: 'localhost',
 *     		//			port: null,
 *     		//			db: 'test_database'
 *     		//		}
 *     		//	},
 *     		//	{ 
 *     		//		store: {name: 'collection2'},
 *     		//		source: { 
 *     		//			name: 'test_mongo',
 *     		//			type: 'mongo',
 *     		//			user: '',
 *     		//			passw: '',
 *     		//			server: 'localhost',
 *     		//			port: null,
 *     		//			db: 'test_database'
 *     		//		}
 *     		//	}
 *     		//]
 *     });
 *
 */
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
				callback(new Error('Error connecting to the mongo server'));
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

					if (callback)
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
			callback(new Error('Error connecting to the mongo server'));
	});

}

/**
 * A public method that adds a field 'size'
 * to the store (mongo collection) configuration
 * specified in <code>store_config</code>.
 * @method getStoreSize
 * @param {json} store_config Store (mongo collection) configuration
 * @param {function} callback Callback function
 * @return {array} An array of stores (mongo collections) configuration with
 * additional 'size' field
 * 
 * @example
 *     var mongo_connector = require('../connectors/MongoConnector');
 *
 *     //the MongoDB database 'test_database' has the following collections:
 *     //	- collection1
 *     //	- collection2
 *
 *     //config file
 *     var store_config = {
 *     	store: {name: 'collection1'},
 *     	source: {
 *     			name: 'test_mongo',
 *     			type: 'mongo',
 *     			user: '',
 *     			passw: '',
 *     			server: 'localhost',
 *     			port: null,
 *     			db: 'test_database'
 *     	} 
 *     };
 *
 *     //requesting the size
 *     mongo_connnector.getStoreSize(store_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//{ 
 *     		//	store: {name: 'collection1', size: 4},
 *     		//	source: { 
 *     		//		name: 'test_mongo',
 *     		//		type: 'mongo',
 *     		//		user: '',
 *     		//		passw: '',
 *     		//		server: 'localhost',
 *     		//		port: null,
 *     		//		db: 'test_database'
 *     		//	}
 *     		//}
 *     });
 *
 */
MongoConnector.getStoreSize = function(store_config, callback){

	//check the config
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

			//add size to store config
			store_config.store.size = count;

			//send
			if (callback)
				callback(null, store_config);
		}
	});
}

/**
 * A public method that returns
 * the field names present in each
 * document.<br/>
 * Fields are only checked in the 
 * first document of store (mongo collection).<br/>
 * Also the value of each field is saved (cf exemple).<br/>
 * The mongodb '_id' field is ommited.
 * @method getFields
 * @param {json} store_config Store (mongo collection) configuration
 * @param {function} callback Callback function
 * @return {array} An array of fields configuration
 * 
 * @example
 *     var mongo_connector = require('../connectors/MongoConnector');
 *
 *     //the MongoDB database 'test_database' has the following collections:
 *     //	- collection1
 *     //	- collection2
 *
 *     //config file
 *     var store_config = {
 *     	store: {name: 'collection1', size: 4}, //presence of 'size' is optional 
 *     	source: {
 *     			name: 'test_mongo',
 *     			type: 'mongo',
 *     			user: '',
 *     			passw: '',
 *     			server: 'localhost',
 *     			port: null,
 *     			db: 'test_database'
 *     	} 
 *     };
 *
 *     //requesting the fields
 *     mongo_connnector.getFields(store_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//[
 *     		//	{ 
 *     		//		field: {name: 'a', value: 18.11},
 *     		//		store: {name: 'collection1', size: 4},
 *     		//		source: { 
 *     		//			name: 'test_mongo',
 *     		//			type: 'mongo',
 *     		//			user: '',
 *     		//			passw: '',
 *     		//			server: 'localhost',
 *     		//			port: null,
 *     		//			db: 'test_database'
 *     		//		}
 *     		//	},
 *     		//	{
 *     		//		field: {name: 'year', value: '2011'},
 *     		//		store: {name: 'collection2', size: 4},
 *     		//		source: { 
 *     		//			name: 'test_mongo',
 *     		//			type: 'mongo',
 *     		//			user: '',
 *     		//			passw: '',
 *     		//			server: 'localhost',
 *     		//			port: null,
 *     		//			db: 'test_database'
 *     		//		}
 *     		//	}
 *          //]
 *     });
 *
 */
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

			callback(new Error('Error connecting to the mongo server'));
		}
		else {

			//delete all the javascript fields
			doc = JSON.parse(JSON.stringify(document));

			//parse the fields
			fields = [];
			for (var key in doc){

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

			//send the repsonse
			if (fields.length){

				if (callback)
					callback(null, fields);
			}
			else {

				callback(new Error('Cannot list the fields'));
			}

		}
	});
}

/**
 * A public method that takes in the fields configuration file
 * (<code>dataset_config</code>) and returns the requested dataset.
 * @method getDataset
 * @param {json} dataset_config Dataset configuration
 * @param {function} callback Callback function
 * @return {array} A requested dataset
 * 
 * @example
 *     var mongo_connector = require('../connectors/MongoConnector');
 *
 *     //the MongoDB database 'test_database' has the following collections:
 *     //	- collection1
 *     //	- collection2
 *
 *     //config file
 *     var dataset_config = {
 *     	fields: [
 *     		{name: 'year', value: '2011', format: 'YYYY'}, //'value' and 'format' fields are optional
 *     		{name: 'a', value: 18.11}
 *     	],
 *     	store: {name: 'collection1', size: 3},	//presence of 'size' is optional
 *     	source: {
 *     			name: 'test_mongo',
 *     			type: 'mongo',
 *     			user: '',
 *     			passw: '',
 *     			server: 'localhost',
 *     			port: null,
 *     			db: 'test_database'
 *     	} 
 *     };
 *
 *     //requesting the dataset
 *     mongo_connnector.getDataset(dataset_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//[
 *     		//	{ a: 18.11, year: '2011' },
 *     		//	{ a: 21.07, year: '2012' },
 *     		//	{ a: 23.23, year: '2013' },
 *     		//	{ a: 24.24, year: '2014' }
 *     		//]
 *     });
 *
 */
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
	dataset_config.fields.forEach(function(field, index){

		fields[field.name] = 1;
	});

	//launch query
	model.aggregate([{$project: fields}],
		function(err, dataset){
			if (err) {
				callback(err);
			}
			else {

				if (dataset.length){

					//send the response
					if (callback)
						callback(null, dataset);
				}
				else{

					callback(new Error('Cannot load the dataset'));
				}
			}
	});
}

/**
 * A private method that checks
 * the validity of source (mongo database)
 * configuration 
 * @method isValidSourceConfig
 * @private
 * @param {json} source_config Source (mongo database) configuration
 * @return {boolean} true if config is valid, false if not
 */
function isValidSourceConfig(source_config){

	if (!source_config || typeof source_config !== 'object') 
		return false;

	if (!source_config.source)
		return false;

	if (!source_config.source.type || !source_config.source.server || !source_config.source.db)
		return false;

	return true;
}

/**
 * A private method that checks
 * the validity of store (mongo collection)
 * configuration 
 * @method isValidStoreConfig
 * @private
 * @param {json} store_config Store (mongo collection) configuration
 * @return {boolean} true if config is valid, false if not
 */
function isValidStoreConfig(store_config){

	if (!isValidSourceConfig(store_config))
		return false;

	if (!store_config.store)
		return false;

	if (!store_config.store.name)
		return false;

	return true;
}

/**
 * A private method that checks
 * the validity of store dataset
 * configuration 
 * @method isValidDatasetConfig
 * @private
 * @param {json} dataset_config Dataset configuration
 * @return {boolean} true if config is valid, false if not
 */
function isValidDatasetConfig(dataset_config){

	if (!isValidStoreConfig(dataset_config))
		return false;

	if (!dataset_config.fields)
		return false;

	return true;
}

module.exports = MongoConnector;