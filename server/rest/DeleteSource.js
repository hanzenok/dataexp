var fs = require('fs');
var sources_conf = require('../config/sources.json');

//var config_file = './server/config/sources.json';

//adds a new source to the config file
var deleteSource = function(req, res){
	
	//get the name of the source to delete
	var source_name = req.params.source_name;

	if (source_name){

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

		if (index > -1){

			//delete the source
			sources_conf.splice(index, 1);

			//and refresh the config
			fs.writeFile('./server/config/sources3.json', JSON.stringify(sources_conf), 
				function(err){

						if (err){
							res.status(500).send('Source config file error');
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
		// console.log(sources_conf.indexOf('colorado', 'name'));

		// if (underscore.where(sources_conf, {name: source_name}).length){

		// 	// delete
		// }
	}
}

module.exports = deleteSource;