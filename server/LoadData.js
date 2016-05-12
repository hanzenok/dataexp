var mongoose = require('mongoose');

var SourceLoadersEnum = {'mongo': loadMongo};

//returns a promise
function LoadData(config){

	return SourceLoadersEnum[config.source.type].call(this, config);
}

function loadMongo(config){

	//load from mongo database
	var promise = new Promise(function(resolve, reject){

		//database
		var connection = mongoose.createConnection('mongodb://' + config.source.server + ':' + config.source.port + '/' + config.source.db);
		
		//collection
		var model = connection.model('', {}, config.store);
		
		//document fields to load
		var fields = {};
		fields['_id'] = 0; //do not include id field
		if(config.timestamp) fields[config.timestamp.field] = 1;
		if(config.fields.length){

			config.fields.forEach(function(field, index, array){

				fields[field.field] = 1;
			});
		}

		//launch query
		model.aggregate([{$project: fields}],
			function(err, result){
				if (err) {reject(err);}
				else {resolve(result);}
		});

	});

	return promise;
}

module.exports = LoadData;