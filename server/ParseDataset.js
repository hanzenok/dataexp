var tsproc = require('tsproc');
var loadData = require('./LoadData');
var modifyConfig = require('./ModifyConfig');
var moment = require('moment');

var date_borders = [moment.utc('1925', 'YYYY').toISOString(), moment.utc('1935', 'YYYY').toISOString()];

var parseDataset = function(req, res){
	
	var config = req.body;

	if(config.length){

		//console.log('config:'); console.log(config);
		var new_config = modifyConfig(config);
		if(!new_config){

			res.status(500).send('Some field is missing a timestamp');
		}
		console.log(new_config);
		// console.log('new_config:'); console.log(new_config);

		//load all the data
		//from the specified sources
		var n = new_config.length;
		var promises = new Array(n);
		for(var i=0; i<n; i++){

			promises[i] = loadData(new_config[i]);
		}

		//process the data
		Promise.all(promises)
		.then(function(stores){

			//callback
			var callback = function(err, data){

				if (err) res.send(err.stack);
				if (data) res.json(data);
			}

			//parse new config
			var tsproc_config = {};
			tsproc_config.timeseries = [];
			new_config.forEach(function(config, index, array){

				tsproc_config.timeseries.push(config);
			});

			tsp = new tsproc(stores, tsproc_config, callback);
			tsp.process(date_borders, callback);

		})
		.catch(function(error){
			res.send(error);	
		});
	}
}


module.exports = parseDataset;