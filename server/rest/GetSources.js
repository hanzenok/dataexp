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
 * A method that returns a JSON file
 * with configuration of sources (ex: MySQL database)
 * <br/>
 * The configuration on the server is stored in the file
 * <code>./server/config/sources.json</code>
 * @method getSources
 * @param {request} req Express.js request
 * @param {response} res Express.js response
 *
 */
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
