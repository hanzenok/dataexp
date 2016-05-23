var fs = require('fs');

var config_file = './server/config/sources.json';

//adds a new source to the config file
var deleteSource = function(req, res){
	
	//get the name of the source to delete
	var source_name = req.params.source_name;

	if (source_name){

		//reading the config file
		fs.readFile(config_file, function(err, data){

			if (err){
			
				res.status(500).send('Sources config file error');
			}
			else{

				var sources_conf = JSON.parse(data);

				//check if the source with name source_name is 
				//in the config file
				var n = sources_conf.length;
				var index = -1;
				for (var i=0; i<n; i++){

					if (sources_conf[i].name === source_name){

						index = i;
						break;
					}
				}

				//removing
				if (index > -1){

					//delete the source
					sources_conf.splice(index, 1);

					//and refresh the config
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

					res.status(500).send('Unauthorized delete');
				}
			}
		});
	}
}

module.exports = deleteSource;