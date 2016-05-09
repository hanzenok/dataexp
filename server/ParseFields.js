var fs = require('fs');
var mongoose = require('mongoose');

var parseFields = function(req, res){
	
	var stores = req.body;

	if(stores.length){

		var doc, entity;
		var url, connection, model;

		var n = stores.length;
		var promises = new Array(n);
		for (var i=0; i<n; i++){

			promises[i] = new Promise(function(resolve, reject){

				url = 'mongodb://' + stores[i].source.server + ':' + stores[i].source.port + '/' + stores[i].source.db;

				connection = mongoose.createConnection(url);
				model = connection.model('', {}, stores[i].name);


				model.findOne({}, function(err, document){

					if(err) reject(err);
					else {

						//delete all the javascript fields
						doc = JSON.parse(JSON.stringify(document));

						entity = {};
						entity.fields = [];
						for(var key in doc){

							if (key !== '_id'){

								entity.fields.push({'field': key});
							}
						}

						resolve(entity);
						//entity.store = stores[i].name;
						//entity.source = stores[i].source;
					}
				});

			});
		}


		//wait for fields
		Promise.all(promises)
		.then(function(entitys){

			var n = entitys.length;
			for (var i=0; i<n; i++){

				entitys[i].store = stores[i].name;
				entitys[i].source = stores[i].source;
			}

			//send the response
			res.send(entitys);
		})
		.catch(function(error){
			res.send(error);	
		});
	}
}

module.exports = parseFields;