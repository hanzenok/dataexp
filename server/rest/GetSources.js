var fs = require('fs');

/**
 * Rest API's offered by server.
 * @module server
 * @submodule RestApi
 */

/**
 * @class GetSources
 */

//config file path
var config_file = './server/config/sources.json';

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

	fs.readFile(config_file, 'utf-8', function(err, data){

		//file does not exists
		if (err){
			
			fs.writeFile(config_file, '[]', function(erR){

				if (erR) res.status(500).send('Sources config missing, cannot create a new one');
				else res.status(500).send('Sources config missing, created a new one');
			});
		}
		else{

			//send the sources
			var sources = (data.length) ? JSON.parse(data) : [];
			res.json(sources);
		}
	});
}

module.exports = getSources;
