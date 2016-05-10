var fs = require('fs');
var mongoose = require('mongoose');

var fields_file = './server/config/fields.json';

var saveFields = function(req, res){
	
	var stores = req.body;

	if(stores.length){

		var doc, entity;
		var url, connection, model;

		//connect to each database in a promise
		var n = stores.length;
		var promises = new Array(n);
		for (var i=0; i<n; i++){

			promises[i] = new Promise(function(resolve, reject){

				url = 'mongodb://' + stores[i].source.server + ':' + stores[i].source.port + '/' + stores[i].source.db;
				connection = mongoose.createConnection(url);
				model = connection.model('', {}, stores[i].name);

				//find the first document
				//we suppose that it's fields are the same for all
				//the documents in the collection
				model.findOne({}, function(err, document){

					if(err) reject(err);
					else {

						//delete all the javascript fields
						doc = JSON.parse(JSON.stringify(document));

						//parse the fields
						entity = {};
						entity.fields = [];
						for(var key in doc){

							if (key !== '_id'){

								entity.fields.push({'name': key});
							}
						}

						resolve(entity);
					}
				});

			});
		}


		//wait for parsed fields
		//add sources and stores 
		//information
		Promise.all(promises)
		.then(function(entitys){

			var n = entitys.length;
			for (var i=0; i<n; i++){

				entitys[i].store = stores[i].name;
				entitys[i].source = stores[i].source;
			}

			//save json to the file
			fs.writeFile(fields_file, JSON.stringify(entitys), function(err){

				res.send(err);
			});
			console.log(JSON.stringify(entitys));
			res.json(entitys);
			
		})
		.catch(function(error){
			res.send(error);	
		});
	}
}

var parseFields = function(req, res){

	fs.readFile(fields_file, function(err, data){
		if(err) res.send(JSON.parse('[]'));
		else res.json(JSON.parse(data));
	});

}

module.exports = {'saveFields': saveFields, 'parseFields': parseFields};