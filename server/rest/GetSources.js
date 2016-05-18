var fs = require('fs');

var getSources = function(req, res){
	
	var config_file = './server/config/sources.json';

	fs.readFile(config_file, function(err, data){
		if(err) res.status(500).send(err.message);
		else res.json(JSON.parse(data));
	});
}

module.exports = getSources;
