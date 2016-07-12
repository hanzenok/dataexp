var getSources = require('./rest/GetSources');
var getStores = require('./rest/GetStores');
var getFields = require('./rest/GetFields');
var getTimeseries = require('./rest/GetTimeseries').getTimeseries;
var getStats = require('./rest/GetTimeseries').getStats;
var getConfig = require('./rest/GetTimeseries').getConfig;
var putSource = require('./rest/PutSource');
var deleteSource = require('./rest/DeleteSource');

module.exports = function(app){

	//main page
	app.get('/', function(req, res){

		res.sendFile('app/index.html' , { root : __dirname});
	});

	//REST api
	app.get('/api/sources', getSources);
	app.post('/api/sources', putSource);
	app.delete('/api/sources/:source_name', deleteSource);
	app.post('/api/stores', getStores);
	app.post('/api/fields', getFields);
	app.post('/api/timeseries', getTimeseries);
	app.get('/api/stats', getStats);
	app.get('/api/config', getConfig);

	//other pages
	app.use(function(req, res, next){
	
		res.setHeader('Content-Type', 'text/plain');
		res.status(404).send('404 - File not found')
	});

};
