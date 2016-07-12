var mysql = require("mysql");

/**
 * Connectors to different types of storages.
 * @module server
 * @submodule Connectors
 */

/**
 * A connector to the MySQL database
 * @class MysqlConnector
 */
var MysqlConnector = {};

MysqlConnector.getStoreNames = function(source_config, callback){

	//check the source config
	if (!isValidSourceConfig(source_config)){

		if (callback) 
			callback(new Error('Invalid source config file'));

		return;
	}

	//creating the connection
	var connection = mysql.createConnection({

		host: source_config.source.server,
		user: source_config.source.user,
		password: source_config.source.passw,
		database: source_config.source.db
	});

	//connecting
	connection.connect(function(err){

		if (err){
			if (callback){
				callback(new Error('Error connecting to the mysql server'));
			}
		}

		else{

			//query
			connection.query('SHOW TABLES;', function(err, rows){

				if (err) {

					callback(err);
					return;
				}
				else{

					//assemble the response
					var tmp;
					var stores = [];
					rows.forEach(function(row, index){

						//table name
						tmp = {};
						tmp.store = {};
						tmp.store.name = rows[index]['Tables_in_' + source_config.source.db];

						//copy the source
						tmp.source = source_config.source;

						//add
						stores.push(tmp);
					});

					//call the callback
					if (stores.length){

						//console.log('stores out of getStoreNames():');
						//console.log(stores);

						callback(null, stores);
					}
					else{
						callback(new Error('Cannot list the stores'));
					}
				}
			});

			//close the connection
			connection.end();
		}
	});
}

MysqlConnector.getStoreSize = function(store_config, callback){

	if (!isValidStoreConfig.call(this, store_config)){

		if (callback) 
			callback(new Error('Invalid store config'));

		return;
	}

	//console.log('store_config in for getStoreSize():');
	//console.log(store_config);


	//creating the connection
	var connection = mysql.createConnection({

		host: store_config.source.server,
		user: store_config.source.user,
		password: store_config.source.passw,
		database: store_config.source.db
	});

	//connecting
	connection.connect(function(err){

		if (err){
			if (callback){
				callback(new Error('Error connecting to the mysql server'));
			}
		}
		else{

			//query
			connection.query('SELECT COUNT(*) AS count FROM ' + store_config.store.name + ';', function(err, rows){

				if (err) {

					callback(new Error('Cannot get the store size'));
					return;
				}
				else{

					//set the size
					store_config.store.size = rows[0].count;

					//console.log('store_config out of getStoreSize():');
					//console.log(store_config);

					callback(null, store_config);
				}

			});

			//close the connection
			connection.end()
		}
	});
}

MysqlConnector.getFields = function(store_config, callback){

	//check the store config
	if (!isValidStoreConfig.call(this, store_config)){

		if (callback) 
			callback(new Error('Invalid store config'));

		return;
	}

	//console.log('store_config in for getFields():');
	//console.log(store_config);

	//creating the connection
	var connection = mysql.createConnection({

		host: store_config.source.server,
		user: store_config.source.user,
		password: store_config.source.passw,
		database: store_config.source.db
	});

	//connecting
	connection.connect(function(err){

		if (err){
			if (callback){
				callback(new Error('Error connecting to the mysql server'));
			}
		}
		else{
			
			//query only one row from database
			connection.query('SELECT * FROM ' + store_config.store.name + ' LIMIT 1;', function(err, rows){

				if (err) {

					callback(err);
					return;
				}
				else{

					//assemble the fields
					var fields = [];
					var tmp;
					for (var key in rows[0]){

						tmp = {};
						tmp.field = {};

						//name and value
						tmp.field.name = key;
						tmp.field.value = rows[0][key];

						//copy store and source
						tmp.store = store_config.store;
						tmp.source = store_config.source;

						//add
						fields.push(tmp);
					}

					//send the repsonse
					if (fields.length){

						//console.log('fields out of getFields():');
						//console.log(fields);

						callback(null, fields);
					}
					else {

						callback(new Error('Cannot list the fields'));
					}
				}

			});

			//close the connection
			connection.end();
		}
	});

}

MysqlConnector.getDataset = function(dataset_config, callback){

	//check the field config
	if (!isValidDatasetConfig.call(this, dataset_config)){

		if (callback) 
			callback(new Error('Invalid dataset config'));

		return;
	}

	//console.log('dataset_config in for getDataset():');
	//console.log(dataset_config);

	//creating the connection
	var connection = mysql.createConnection({

		host: dataset_config.source.server,
		user: dataset_config.source.user,
		password: dataset_config.source.passw,
		database: dataset_config.source.db
	});

	//connecting
	connection.connect(function(err){

		if (err){
			if (callback){
				callback(new Error('Error connecting to the mysql server'));
			}
		}
		else{
			
			//assemble the fields to query
			var n = dataset_config.fields.length;
			var fields = '';
			for (var i=0; i<n-1; i++){

				fields += dataset_config.fields[i].name + ',';
			}
			fields += dataset_config.fields[i].name;

			//query
			connection.query('SELECT ' + fields + ' FROM ' + dataset_config.store.name + ';', function(err, rows){

				if (err) {

					callback(err);
					return;
				}
				else{

					//delete the mysql fields
					var dataset = [];
					rows.forEach(function(row, index){
						dataset.push(JSON.parse(JSON.stringify(rows[index])));
					});

					//send the response
					if (dataset.length){

						//console.log('dataset out for getDataset():');
						//console.log(dataset);

						//send the response
						callback(null, dataset);
					}
					else{

						callback(new Error('Cannot load the dataset'));
					}
				}
			});

			//close the connection
			connection.end();
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

module.exports = MysqlConnector;