var getSources = require('./rest/GetSources');
var getStores = require('./rest/GetStores');
var getFields = require('./rest/GetFields');
var getTimeseries = require('./rest/GetTimeseries').getTimeseries;
var getStats = require('./rest/GetTimeseries').getStats;
var getConfig = require('./rest/GetTimeseries').getConfig;
var putSource = require('./rest/PutSource');
var deleteSource = require('./rest/DeleteSource');

/**
 * Rest API's offered by server.
 * @module server
 * @submodule RestApi
 */

/**
 * A class (module) that defines all 
 * the API URLs, and the related methods.
 * <br/>
 * Here are some of the URLs: <br/>
 * - <b>/api/sources</b>: GET a JSON with sources configuration
 * - <b>/api/sources</b>: POST a new source, returns an empty array
 * - <b>/api/sources/:source_name</b>: DELETE source, returns an empty array
 * - <b>/api/stores</b>: POST a sources config, returns an array of stores
 * - <b>/api/fields</b>: POST a stores config, returns an array of fields
 * - <b>/api/timeseries</b>: POST a fields config, returns the realted dataset
 * - <b>/api/stats</b>: GET statistics from tsproc
 * - <b>/api/config</b>: GET configuration JSON of tsproc
 * @class routes
 */

module.exports = function(app){

	//main page
	app.get('/', function(req, res){

		res.sendFile('app/index.html' , { root : __dirname});
	});

	//all REST APIs
	app.get('/api/sources', getSources);					//get the list of all the sources
	app.post('/api/sources', putSource);					//adding a source
	app.delete('/api/sources/:source_name', deleteSource);	//delete a specific source
	app.post('/api/stores', getStores);						//get the list of all the stores of a specific source
	app.post('/api/fields', getFields);						//get the list of all the fields of a specific store
	app.post('/api/timeseries', getTimeseries);				//get the dataset
	app.get('/api/stats', getStats);						//get some statistics
	app.get('/api/config', getConfig);						//get the config JSON

	//other pages
	app.use(function(req, res, next){
	
		res.setHeader('Content-Type', 'text/plain');
		res.status(404).send('404 - File not found')
	});

};
