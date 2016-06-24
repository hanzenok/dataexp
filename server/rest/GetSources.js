var fs = require('fs');

var config_file = './server/config/sources.json';

var getSources = function(req, res){

	fs.readFile(config_file, 'utf-8', function(err, data){

		if (err){
		
			res.status(500).send('Sources config file error');
		}
		else{

			//send the sources
			var sources = (data.length) ? JSON.parse(data) : [];
			res.json(sources);
		}
	});
}

module.exports = getSources;
