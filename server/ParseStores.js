var fs = require('fs');
var mongoose = require('mongoose');

var parseStores = function(req, res){
	
	var config_file = './server/config/sources.json';

	fs.readFile(config_file, function(err, data){
		if (err) res.send(JSON.parse('[]'));
		else {

			var config = JSON.parse(data);
			var i = 0;
			var url = 'mongodb://' + config[i].server + ':' + config[i].port + '/' + config[i].db;
			
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

						var tmp = {};
						var stores = [];
						items.forEach(function(item, index, array){

							if(item.name.indexOf('system.') === -1){

								tmp.name = item.name;
								tmp.source = config[i];
								stores.push(tmp);

								tmp = {};
							}
						});

						res.json(stores);
					}
				});
			});

			db.on('error', function(error){
				//throw new Error(err);
				res.send(JSON.parse('[]'));
			});
		}
	});
}

module.exports = parseStores;
