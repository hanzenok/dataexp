var fs = require('fs');

var config_file = './server/config/sources.json';

var getSources = function(req, res){

	fs.readFile(config_file, function(err, data){

		if (err){
		
			res.status(500).send('Sources config file error');
		}
		else{

			res.json(JSON.parse(data));
		}
	});
}

module.exports = getSources;
