var getSources = require('./rest/GetSources');
var getStores = require('./rest/GetStores');
var getFields = require('./rest/GetFields');
var getDataset = require('./rest/GetDataset');
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
	app.post('/api/dataset', getDataset);
	// app.delete('/api/sources/:source_name', function(req, res){

	// 	console.log(req.params.source_name);
	// });

	//other pages
	app.use(function(req, res, next){
	
		res.setHeader('Content-Type', 'text/plain');
		res.status(404).send('Page introuvable')
	});

};
