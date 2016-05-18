var fs = require('fs');
var mongoose = require('mongoose');
var async = require('async');
var mongo_connector = require('../connectors/MongoConnector');

var ConnectorsEnum = {'mongo': mongo_connector};

var config_file = './server/config/sources.json';

var getStores = function(req, res){

	//read the sources config file
	fs.readFile(config_file, function(err, data){

		if (err) {

			res.status(500).send('Error reading config file');
			return;
		}
		else {

			var configs = JSON.parse(data);
			var n = configs.length;
			var promises = new Array(n);


			// async.series([
			// 	function(callback){

			// 		ConnectorsEnum['mongo'].getStores(configs[1], function(error, stores){
			// 			if (stores) {console.log(stores); callback(null, stores);}
			// 			if (error) {console.log(error); callback(error, null);}
			// 		});	
			//     },
			//     function(callback){
			//         console.log('two');
			//         callback(null, 'two');
			//     },
			// 	function(callback){

			// 		ConnectorsEnum['mongo'].getStores(configs[0], function(error, stores){
			// 			if (stores) {console.log(stores); callback(null, stores);}
			// 			if (error) {console.log(error); callback(error, null);}
			// 		});	
			//     }
			// ],
			// // optional callback
			// function(err, results){
			//     console.log(results);
			// });

			// async.series([
			// 		function(callback){
			// 			ConnectorsEnum['mongo'].getStores(configs[1], function(error, stores){

			// 				if (stores) console.log(stores);//callback(null, stores);
			// 				if (error) console.log(error);
			// 			});	
			// 		},
			// 		function(callback){
			// 			ConnectorsEnum['mongo'].getStores(configs[0], function(error, stores){

			// 				if (stores) console.log(stores);//callback(null, stores);
			// 				if (error) console.log(error);
			// 			});	
			// 		}
			// 	]
			// );

			/*ConnectorsEnum['mongo'].getStores(configs[0], function(error, stores){

				if (stores) console.log(stores);
				if (error) console.log(error);
			});

			setTimeout(function(){

				ConnectorsEnum['mongo'].getStores(configs[1], function(error, stores){

					if (stores) console.log(stores);
					if (error) console.log(error);
				});				
			}, 3000);*/

			//load the stoars of each source
			for(i=0; i<n; i++){

				promises[i] = new Promise(function(resolve, reject){

					ConnectorsEnum['mongo'].getStores(configs[i], function(error, stores){

						if (stores) resolve(stores);
						if (error) reject(error);
					});
				});
				
			}

			//wait for all the stores
			Promise.all(promises)
			.then(function(stores){


				console.log(stores);
			})
			.catch(function(error){
				console.log(error);
				res.status(500).send(error);	
			});
		}
	});
}

module.exports = getStores;
