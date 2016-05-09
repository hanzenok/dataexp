var fs = require('fs');
var mongoose = require('mongoose');
var underscore = require('underscore');

var parseStores = function(req, res){
	
	var config_file = './server/config/sources.json';

	fs.readFile(config_file, function(err, data){
		if (err) res.send(JSON.parse('[]'));
		else {

			var config = JSON.parse(data);
			var url = 'mongodb://' + config[0].server + ':' + config[0].port + '/' + config[0].db;
			
			mongoose.connect(url);
			var db = mongoose.connection;

			db.once('open', function(){

				mongoose.connection.db.listCollections(true).toArray(function(err, items){

					if (err) {
						throw new Error(err);
						res.send(JSON.parse('[]'));
					}
					else {
						db.close();
						var names = [];
						items.forEach(function(item, index, array){

							if(item.name.indexOf('system.') === -1)
							names.push(item);
						});

						res.json(names);
					}
				});
			});

			db.on('error', function(error){
				throw new Error(err);
				res.send(JSON.parse('[]'));
			});
		}
	});
}

module.exports = parseStores;
