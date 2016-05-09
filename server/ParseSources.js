var fs = require('fs');

var parseConfig = function(req, res){
	
	var config_file = './server/config/sources.json';

	fs.readFile(config_file, function(err, data){
		if(err) res.send(JSON.parse('[]'));
		else res.json(JSON.parse(data));
	});
}

module.exports = parseConfig;
