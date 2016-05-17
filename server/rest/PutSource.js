var fs = require('fs');

var config_file = './server/config/sources.json';

//adds a new source to the config file
var putSource = function(req, res){
	
	//get the requested stores
	var source = req.body;

	if(source){

		fs.readFile(config_file, function(err, data){
			if(err) {

				res.status(500).send(err);
				return;
			}
			else {

				var old_conf = JSON.parse(data);
				console.log(old_conf);
				console.log(source);
			}
		});
	}


}


module.exports = putSource;