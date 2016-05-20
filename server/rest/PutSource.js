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

				//sources configuration file
				var sources_conf = JSON.parse(data);

				//if client demands to add a new source
				if (source_conf.isNew){

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
				//if client demands to modify an existing source
				else{

					//check if the source with name source_name is 
					//in the config file
					var n = sources_conf.length;
					var index = -1;
					for (var i=0; i<n; i++){

						if (sources_conf[i].name === source_conf.name){

							index = i;
							break;
						}
					}

					if(index > -1){

						//modify the source config
						sources_conf[index] = source_conf;

						//write the modif to the file
						fs.writeFile('./server/config/sources.json', JSON.stringify(sources_conf), 
							function(err){

									if (err){
										res.status(500).send('Sources config file error');
									}
									else{
										res.send([{}]);
									}

							}
						);
					}
					else{

						res.status(500).send('The source name doesn\'t supposed to change');
					}
				}
				
			}
		});
	}


}


module.exports = putSource;