var mongoose = require('mongoose');

var mongo_connector = require('../connectors/MongoConnector');
var ConnectorsEnum = {'mongo': mongo_connector};

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
		.then(function(fieldnames){

			var fields = [];
			var m,n = fieldnames.length;
			for (var i=0; i<n; i++){

				m = fieldnames[i].length;
				for(var j=0; j<m; j++){

					//add stores and sources to the fields
					fieldnames[i][j].store = stores_conf[i].store;
					fieldnames[i][j].source = stores_conf[i].source;

					//push to the new array
					fields.push(fieldnames[i][j]);
				}
			}

			//send the response
			res.json(fields);
			
		})
		.catch(function(error){

			res.status(500).send(error);
		});
	}
}


module.exports = getFields;