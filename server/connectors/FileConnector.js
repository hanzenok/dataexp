var fs = require('fs');

var dataset_prefix = './server/datasets/';

var FileConnector = {};

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

FileConnector.getStoreSize = function(store_config, callback){

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

			//add size
			store_config.store.size = dataset.length;
			
			//send
			if (callback)
				callback(null, store_config);
		}
	});


}

//get all the fields of a store
FileConnector.getFields = function(store_config, callback){

	//check the store config
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

	if (!dataset_config.fields)
		return false;

	return true;
}

module.exports = FileConnector;