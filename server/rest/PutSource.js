var fs = require('fs');
var underscore = require('underscore');

/**
 * Rest API's offered by server.
 * @module server
 * @submodule RestApi
 */

/**
 * @class PutSource
 */

var config_file = './server/config/sources.json'; //config file path
var dataset_prefix = './server/datasets/'; //directory with sources of type 'file' (JSON and CSV)

/**
 * A method that adds a new source configuration
 * to the <code>./server/config/sources.json</code>
 * file. The source to add is passed via the <code>req</code>
 * object.
 * <br/>
 * If the new source is a file (JSON or CSV),
 * then it would be saved as a json to the directory 
 * <code>./server/datasets/</code>.
 * <br/>
 * An empty array is returned by the <code>res</code> object.
 * @method putSource
 * @param {request} req Express.js request
 * @param {response} res Express.js response
 */
var putSource = function(req, res){
	
	//get the recieved source
	var source_conf = req.body;

	if (source_conf){

		//if a source is a file
		if (source_conf.data){

			//save the dataset
			fs.writeFile(dataset_prefix + source_conf.name + '.json', JSON.stringify(source_conf.data), function(err){

				if (err){
					res.status(500).send('Saving dataset error');
				}
				else{
					res.send([{}]);
				}

			});
		}
		else{

			//read the file
			fs.readFile(config_file, function(err, data){
				if (err){

					res.status(500).send('Sources config file error');
					return;
				}
				if (data){

					//if for some reason, the config file exists,
					//but completely empty (does not contains 
					//even the '[]')
					if (data.length === 0) data = '[]';

					//sources configuration file
					var sources_conf = JSON.parse(data);

					//if client demands to add a new source
					if (source_conf.source.isNew){

						//if config already exists
						var exists = false;
						sources_conf.forEach(function(conf, index){

							if (conf.source.name === source_conf.source.name){
								exists = true
								return;
							}
						});
						if (exists){
							res.status(500).send('Specified source name alredy exists');
							return;
						}
						else{

							//assemble the new config file
							source_conf.source.isNew = false;
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

							if (sources_conf[i].source.name === source_conf.source.name){

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
}

module.exports = putSource;