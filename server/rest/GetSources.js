var fs = require('fs');

/**
 * Rest API's offered by server.
 * @module server
 * @submodule RestApi
 */

/**
 * @class GetSources
 */

//config dir
var config_dir = './server/config';

//config file path
var config_file = config_dir + '/sources.json';

/**
 * A method that returns (via the object <code>res</code>) a JSON file
 * with configuration of sources (ex: MySQL database).
 * <br/>
 * The configuration on the server is stored in the file
 * <code>./server/config/sources.json</code>.
 * It the config is missing, it would be created.
 * @method getSources
 * @param {request} req Express.js request
 * @param {response} res Express.js response
 */
var getSources = function(req, res){

	//callback launched
	//on file creation
	var cb_create_file = function(err){

		if (err) res.status(500).send('Sources config missing, cannot create a new one');
		else res.status(500).send('Sources config missing, created a new one');
	}

	//read the config file
	fs.mkdir(config_dir, 0777, function(err){

		//check if folder exists
		if (err) {

			//folder exists
			if (err.code === 'EEXIST'){

				//check if file exists
				fs.readFile(config_file, 'utf-8', function(err, data){

					//file does not exists
					if (err){
						
						//create it
						fs.writeFile(config_file, '[]', cb_create_file);
					}
					else{

						//send the sources
						var sources = (data.length) ? JSON.parse(data) : [];
						res.json(sources);
					}
				});

			}
			//other errors
			else res.status(500).send('Error checking the config folder existence');
		}

		//folder does not exists, created
		else{

			//create file
			fs.writeFile(config_file, '[]', cb_create_file);
		}
	});
}

module.exports = getSources;
