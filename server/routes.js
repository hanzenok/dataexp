var parseSources = require('./ParseSources');
var parseStores = require('./ParseStores');
var parseFields = require('./ParseFields');
var parseDataset = require('./ParseDataset');

module.exports = function(app){

	//main page
	app.get('/', function(req, res){

		res.sendFile('app/index.html' , { root : __dirname});
	});

	//REST api
	app.get('/api/sources', parseSources);
	app.get('/api/stores', parseStores);
	app.post('/api/fields', parseFields);
	app.post('/api/dataset', parseDataset);

	//other pages
	app.use(function(req, res, next){
	
		res.setHeader('Content-Type', 'text/plain');
		res.status(404).send('Page introuvable')
	});

};
