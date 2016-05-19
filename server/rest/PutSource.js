var fs = require('fs');
var underscore = require('underscore');

var config_file = './server/config/sources.json';

//adds a new source to the config file
var putSource = function(req, res){
	
	//get the recieved source
	var source_conf = req.body;

	if (source_conf){

		fs.readFile(config_file, function(err, data){
			if (err) {

				res.status(500).send('Sources config file error');
				return;
			}
			if (data){

				var sources_conf = JSON.parse(data);

				//if config already exists
				if (underscore.where(sources_conf, {name: source_conf.name}).length){

					res.status(500).send('Specified source name alredy exists');
					return;
				}
				else{

					//assemble the new config file
					var new_config = sources_conf.concat(source_conf);

					//save it to the fiels
					fs.writeFile(config_file, JSON.stringify(new_config), function(err){

						if (err){
							res.status(500).send('Source config file error');
						}
						else{
							res.send([{}]);
						}

					});
				}
				
			}
		});
	}


}


module.exports = putSource;