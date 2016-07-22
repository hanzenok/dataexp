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

/**
 * A public method that returns the 
 * names of the stores (mysql tables)
 * that are present in the specified by
 * config file database.
 * @method getStoreNames
 * @param {json} source_config Source (mysql database) configuration
 * @param {function} callback Callback function
 * @return {array} An array of stores (mysql tables) configuration
 * 
 * @example
 *     var mysql_connector = require('../connectors/MysqlConnector');
 *
 *     //the MySQL database 'test_database' has the following tables:
 *     //	- table1
 *     //	- table2
 *
 *     //config file
 *     var source_config = { 
 *     	source: {
 *     			name: 'test_mysql',
 *     			type: 'mysql',
 *     			user: 'root',
 *     			passw: 'root',
 *     			server: 'localhost',
 *     			port: null,
 *     			db: 'test_database'
 *     	} 
 *     };
 *
 *     //requesting the stores
 *     mysql_connnector.getStoreNames(source_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//[ 
 *     		//	{ 
 *     		//		store: {name: 'table1'},
 *     		//		source: { 
 *     		//			name: 'test_mysql',
 *     		//			type: 'mysql',
 *     		//			user: 'root',
 *     		//			passw: 'root',
 *     		//			server: 'localhost',
 *     		//			port: null,
 *     		//			db: 'test_database'
 *     		//		}
 *     		//	},
 *     		//	{ 
 *     		//		store: {name: 'table2'},
 *     		//		source: { 
 *     		//			name: 'test_mysql',
 *     		//			type: 'mysql',
 *     		//			user: 'root',
 *     		//			passw: 'root',
 *     		//			server: 'localhost',
 *     		//			port: null,
 *     		//			db: 'test_database'
 *     		//		}
 *     		//	}
 *     		//]
 *     });
 *
 */
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

						if (callback)
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

/**
 * A public method that adds a field 'size'
 * to the store (mysql table) configuration
 * specified in <code>store_config</code>.
 * @method getStoreSize
 * @param {json} store_config Store (mysql table) configuration
 * @param {function} callback Callback function
 * @return {array} An array of stores (mysql tables) configuration with
 * additional 'size' field
 * 
 * @example
 *     var mysql_connector = require('../connectors/MysqlConnector');
 *
 *     //the MySQL database 'test_database' has the following tables:
 *     //	- table1
 *     //	- table2
 *
 *     //config file
 *     var store_config = {
 *     	store: {name: 'table1'},
 *     	source: {
 *     			name: 'test_mysql',
 *     			type: 'mysql',
 *     			user: 'root',
 *     			passw: 'root',
 *     			server: 'localhost',
 *     			port: null,
 *     			db: 'test_database'
 *     	} 
 *     };
 *
 *     //requesting the size
 *     mysql_connnector.getStoreSize(store_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//{ 
 *     		//	store: {name: 'table1', size: 4},
 *     		//	source: { 
 *     		//		name: 'test_mysql',
 *     		//		type: 'mysql',
 *     		//		user: 'root',
 *     		//		passw: 'root',
 *     		//		server: 'localhost',
 *     		//		port: null,
 *     		//		db: 'test_database'
 *     		//	}
 *     		//}
 *     });
 *
 */
MysqlConnector.getStoreSize = function(store_config, callback){

	//check the config
	if (!isValidStoreConfig.call(this, store_config)){

		if (callback) 
			callback(new Error('Invalid store config'));

		return;
	}

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

				callback(new Error('Error connecting to the mysql server'));
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

					if (callback)
						callback(null, store_config);
				}

			});

			//close the connection
			connection.end()
		}
	});
}

/**
 * A public method that returns
 * the column names of the table.<br/>
 * Also the first value of each column is saved (cf exemple).<br/>
 * @method getFields
 * @param {json} store_config Store (mysql table) configuration
 * @param {function} callback Callback function
 * @return {array} An array of fields configuration
 * 
 * @example
 *     var mysql_connector = require('../connectors/MysqlConnector');
 *
 *     //the MySQL database 'test_database' has the following tables:
 *     //	- table1
 *     //	- table2
 *
 *     //config file
 *     var store_config = {
 *     	store: {name: 'table1', size: 4}, //presence of 'size' is optional 
 *     	source: {
 *     			name: 'test_mysql',
 *     			type: 'mysql',
 *     			user: 'root',
 *     			passw: 'root',
 *     			server: 'localhost',
 *     			port: null,
 *     			db: 'test_database'
 *     	} 
 *     };
 *
 *     //requesting the fields
 *     mysql_connnector.getFields(store_config, function(err, data){
 *	
 *     		if (data) console.log(data);
 *     		//the result is:
 *     		//[
 *     		//	{ 
 *     		//		field: {name: 'a', value: 18.11},
 *     		//		store: {name: 'table1', size: 4},
 *     		//		source: { 
 *     		//			name: 'test_mysql',
 *     		//			type: 'mysql',
 *     		//			user: 'root',
 *     		//			passw: 'root',
 *     		//			server: 'localhost',
 *     		//			port: null,
 *     		//			db: 'test_database'
 *     		//		}
 *     		//	},
 *     		//	{
 *     		//		field: {name: 'year', value: '2011'},
 *     		//		store: {name: 'table1', size: 4},
 *     		//		source: { 
 *     		//			name: 'test_mysql',
 *     		//			type: 'mysql',
 *     		//			user: 'root',
 *     		//			passw: 'root',
 *     		//			server: 'localhost',
 *     		//			port: null,
 *     		//			db: 'test_database'
 *     		//		}
 *     		//	}
 *          //]
 *     });
 *
 */
MysqlConnector.getFields = function(store_config, callback){

	//check the store config
	if (!isValidStoreConfig.call(this, store_config)){

		if (callback) 
			callback(new Error('Invalid store config'));

		return;
	}

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

			callback(new Error('Error connecting to the mysql server'));
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

						if (callback)
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

/**
 * A public method that takes in the fields configuration file
 * (<code>dataset_config</code>) and returns the requested dataset.
 * @method getDataset
 * @param {json} dataset_config Dataset configuration
 * @param {function} callback Callback function
 * @return {array} A requested dataset
 * 
 * @example
 *     var mysql_connector = require('../connectors/MysqlConnector');
 *
 *     //the MySQL database 'test_database' has the following tables:
 *     //	- table1
 *     //	- table2
 *
 *     //config file
 *     var dataset_config = {
 *     	fields: [
 *     		{name: 'year', value: '2011', format: 'YYYY'}, //'value' and 'format' fields are optional
 *     		{name: 'a', value: 18.11}
 *     	]
 *     	store: {name: 'table1', size: 4},	//presence of 'size' is optional
 *     	source: {
 *     			name: 'test_mysql',
 *     			type: 'mysql',
 *     			user: 'root',
 *     			passw: 'root',
 *     			server: 'localhost',
 *     			port: null,
 *     			db: 'test_database'
 *     	} 
 *     };
 *
 *     //requesting the dataset
 *     mysql_connnector.getDataset(dataset_config, function(err, data){
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
MysqlConnector.getDataset = function(dataset_config, callback){

	//check the field config
	if (!isValidDatasetConfig.call(this, dataset_config)){

		if (callback) 
			callback(new Error('Invalid dataset config'));

		return;
	}

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

						//send the response
						if (callback)
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

/**
 * A private method that checks
 * the validity of source (mysql database)
 * configuration 
 * @method isValidSourceConfig
 * @private
 * @param {json} source_config Source (mysql database) configuration
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
 * the validity of store (mysql table)
 * configuration 
 * @method isValidStoreConfig
 * @private
 * @param {json} store_config Store (mysql table) configuration
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

module.exports = MysqlConnector;