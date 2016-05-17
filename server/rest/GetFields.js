var mongoose = require('mongoose');

var getFields = function(req, res){
	
	//get the requested stores
	var stores = req.body;

	if(stores.length){

		var doc, fields;
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
						fields = [];
						for(var key in doc){

							if (key !== '_id'){

								fields.push({'name': key});
							}
						}
						resolve(fields);
					}
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
					fieldnames[i][j].store = stores[i].name;
					fieldnames[i][j].source = stores[i].source;

					//push to the new array
					fields.push(fieldnames[i][j]);
				}
			}

			//send the response
			res.json(fields);
			
		})
		.catch(function(error){
			res.send(error);	
		});
	}
}


module.exports = getFields;