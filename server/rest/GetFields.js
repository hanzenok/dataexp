var mongoose = require('mongoose');

var mongo_connector = require('../connectors/MongoConnector');
var mysql_connector = require('../connectors/MysqlConnector');
var ConnectorsEnum = {
	
					'mongo': mongo_connector,
					'mysql': mysql_connector
					};

var getFields = function(req, res){
	
	//get the requested stores
	var stores_conf = req.body;

	if(stores_conf.length){

		//connect to each database in a promise
		var n = stores_conf.length;
		var promises = new Array(n);
		for (var i=0; i<n; i++){

			promises[i] = new Promise(function(resolve, reject){

				ConnectorsEnum[stores_conf[i].source.type].getFields(stores_conf[i], function(error, fields){

					if (fields) resolve(fields);
					if (error) reject(error);
				});
			});
		}


		//wait for parsed fields
		//add sources and stores 
		//information
		Promise.all(promises)
		.then(function(fields){

			//send the response
			res.json(fields[0]);
			
		})
		.catch(function(error){

			res.status(500).send(error.message);
		});
	}
}

module.exports = getFields;