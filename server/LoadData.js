var mongoose = require('mongoose');

var SourceLoadersEnum = {'mongo': loadMongo};

//returns a promise
function LoadData(config){

	return SourceLoadersEnum[config.source.type].call(this, config);
}

function loadMongo(config){

	//load from mongo database
	var promise = new Promise(function(resolve, reject){

		console.log(config);

		//database
		var connection = mongoose.createConnection('mongodb://' + config.source.server + ':' + config.source.port + '/' + config.source.db);
		
		//collection
		var model = connection.model('', {}, config.store);
		
		//document field
		var field = {};
		field['_id'] = 0; //do not include id field
		field[config.name] = 1; //include only wanted field

		//launch query
		model.aggregate([{$project: field}],
			function(err, result){
				if (err) {reject(err);}
				else {resolve(result);}
		});

	});

	return promise;
}

module.exports = LoadData;