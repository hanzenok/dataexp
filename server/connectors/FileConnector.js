var fs = require('fs');

/**
 * Connectors to different types of storages.
 * @module server
 * @submodule Connectors
 */

var dataset_prefix = './server/datasets/';

/**
 * A connector to the files (JSON and CSV)
 * @class FileConnector
 */
var FileConnector = {};

/**
 * A public method that returns the 
 * name of the store (single one because it's
 * a file) that are present in the specified by
 * config file database.
 * @method getStoreNames
 * @param {json} source_config Source (file) configuration
 * @param {function} callback Callback function
 * @return {array} An array of stores (file) configuration
 * 
 * @example
 *     var file_connector = require('../connectors/FileConnector');
 *
 *     //the json file called 'test.json'
 *
 *     //config file
 *     var source_config = { 
 *     	source: {
 *     			name: 'test',
 *     			type: 'json',
 *     			user: '',
 *     			passw: '',
 *     			server: 'file',
 *     			port: null,
 *     			db: 'test.json'
 *     	} 
 *     };
 *
 *     //requesting the stores
 *     file_connnector.getStoreNames(source_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//[ 
 *     		//	{ 
 *     		//		store: {name: 'test'},
 *     		//		source: { 
 *     		//			name: 'test',
 *     		//			type: 'json',
 *     		//			user: '',
 *     		//			passw: '',
 *     		//			server: 'file',
 *     		//			port: null,
 *     		//			db: 'test.json'
 *     		//		}
 *     		//	}
 *     		//]
 *     });
 *
 */
FileConnector.getStoreNames = function(source_config, callback){

	//check the source config
	if (!isValidSourceConfig(source_config)){

		if (callback) 
			callback(new Error('Invalid source config file'));

		return;
	}

	//send the source name
	var doc = {};
	doc.store = {name: source_config.source.name};
	doc.source = source_config.source;

	if (callback){
		callback(null, [doc]);
	}
}

/**
 * A public method that adds a field 'size'
 * to the store (file) configuration
 * specified in <code>store_config</code>.
 * @method getStoreSize
 * @param {json} store_config Store (file) configuration
 * @param {function} callback Callback function
 * @return {array} An array of stores (file) configuration with
 * additional 'size' field
 * 
 * @example
 *     var file_connector = require('../connectors/FileConnector');
 *
 *     //the json file called 'test.json'
 *
 *     //config file
 *     var store_config = {
 *     	store: {name: 'test'},
 *     	source: {
 *     			name: 'test',
 *     			type: 'json',
 *     			user: '',
 *     			passw: '',
 *     			server: 'file',
 *     			port: null,
 *     			db: 'test.json'
 *     	} 
 *     };
 *
 *     //requesting the size
 *     file_connnector.getStoreSize(store_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//{ 
 *     		//	store: {name: 'test', size: 4},
 *     		//	source: { 
 *     		//		name: 'test',
 *     		//		type: 'json',
 *     		//		user: '',
 *     		//		passw: '',
 *     		//		server: 'file',
 *     		//		port: null,
 *     		//		db: 'test.json'
 *     		//	}
 *     		//}
 *     });
 *
 */
FileConnector.getStoreSize = function(store_config, callback){

	//check the config
	if (!isValidStoreConfig.call(this, store_config)){

		if (callback) 
			callback(new Error('Invalid store config'));

		return;
	}

	//read the file
	fs.readFile(dataset_prefix + store_config.source.name + '.json', function(err, data){

		if (err){
			callback(new Error('Cannot read the dataset'));
		}
		else{

			//get the dataset
			var dataset = JSON.parse(data);

			//add size to the store config
			store_config.store.size = dataset.length;

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
 * first document of store (file).<br/>
 * Also the value of each field is saved (cf exemple).<br/>
 * @method getFields
 * @param {json} store_config Store (file) configuration
 * @param {function} callback Callback function
 * @return {array} An array of fields configuration
 * 
 * @example
 *     var file_connector = require('../connectors/FileConnector');
 *
 *     //the json file called 'test.json'
 *
 *     //config file
 *     var store_config = {
 *     	store: {name: 'test', size: 4}, //presence of 'size' is optional
 *     	source: {
 *     			name: 'test',
 *     			type: 'json',
 *     			user: '',
 *     			passw: '',
 *     			server: 'file',
 *     			port: null,
 *     			db: 'test.json'
 *     	} 
 *     };
 *
 *     //requesting the fields
 *     file_connnector.getFields(store_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//[
 *     		//	{ 
 *     		//		field: {name: 'a', value: 18.11},
 *     		//		store: {name: 'test', size: 4},
 *     		//		source: { 
 *     		//			name: 'test',
 *     		//			type: 'json',
 *     		//			user: '',
 *     		//			passw: '',
 *     		//			server: 'file',
 *     		//			port: null,
 *     		//			db: 'test.json'
 *     		//		}
 *     		//	},
 *     		//	{
 *     		//		field: {name: 'year', value: '2011'},
 *     		//		store: {name: 'test', size: 4},
 *     		//		source: { 
 *     		//			name: 'test',
 *     		//			type: 'json',
 *     		//			user: '',
 *     		//			passw: '',
 *     		//			server: 'file',
 *     		//			port: null,
 *     		//			db: 'test.json'
 *     		//		}
 *     		//	}
 *          //]
 *     });
 *
 */
FileConnector.getFields = function(store_config, callback){

	//check the config
	if (!isValidStoreConfig.call(this, store_config)){

		if (callback) 
			callback(new Error('Invalid store config'));

		return;
	}

	//read the file
	fs.readFile(dataset_prefix + store_config.source.name + '.json', function(err, data){

		if (err){
		
			callback(new Error('Cannot read the dataset'));
		}
		else{

			//get the dataset
			var dataset = JSON.parse(data);

			//get the first document
			var tmp, doc = dataset[0];

			//parse the fields
			var fields = [];
			for (var key in doc){

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

			if (callback)
				callback(null, fields);
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
 *     var file_connector = require('../connectors/FileConnector');
 *
 *     //the json file called 'test.json'
 *
 *     //config file
 *     var dataset_config = {
 *     	fields: [
 *     		{name: 'year', value: '2011', format: 'YYYY'}, //'value' and 'format' fields are optional
 *     		{name: 'a', value: 18.11}
 *     	],
 *     	store: {name: 'test', size: 4}, //presence of 'size' is optional
 *     	source: {
 *     			name: 'test',
 *     			type: 'json',
 *     			user: '',
 *     			passw: '',
 *     			server: 'file',
 *     			port: null,
 *     			db: 'test.json'
 *     	}
 *     };
 *
 *     //requesting the dataset
 *     file_connnector.getDataset(dataset_config, function(err, data){
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
FileConnector.getDataset = function(dataset_config, callback){

	//check the field config
	if (!isValidDatasetConfig.call(this, dataset_config)){

		if (callback) 
			callback(new Error('Invalid dataset config'));

		return;
	}

	//read the file
	fs.readFile(dataset_prefix + dataset_config.source.name + '.json', function(err, data){

		if (err){
		
			callback(new Error('Cannot read the dataset'));
		}
		else{

			//get the dataset
			var dataset = JSON.parse(data);
			var new_dataset = new Array(dataset.length);
			var tmp;

			//go throug each document and 
			//filter the fields
			dataset.forEach(function(doc, index){

				//filter the fields
				tmp = {};
				dataset_config.fields.forEach(function(field, index){

					tmp[field.name] = doc[field.name];
				});

				//add to the dataset
				new_dataset[index] = tmp;

			});

			//send
			if (callback)
				callback(null, new_dataset);
		}
	});
}

/**
 * A private method that checks
 * the validity of source (file)
 * configuration 
 * @method isValidSourceConfig
 * @private
 * @param {json} source_config Source (file) configuration
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
 * the validity of store (file)
 * configuration 
 * @method isValidStoreConfig
 * @private
 * @param {json} store_config Store (file) configuration
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
 * the validity of dataset
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

module.exports = FileConnector;