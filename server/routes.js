var getSources = require('./rest/GetSources');
var getStores = require('./rest/GetStores');
var putFields = require('./rest/PutFields');
var putDataset = require('./rest/PutDataset');

module.exports = function(app){

	//main page
	app.get('/', function(req, res){

		res.sendFile('app/index.html' , { root : __dirname});
	});

	//REST api
	app.get('/api/sources', getSources);
	app.get('/api/stores', getStores);
	app.post('/api/fields', putFields);
	app.post('/api/dataset', putDataset);

	//other pages
	app.use(function(req, res, next){
	
		res.setHeader('Content-Type', 'text/plain');
		res.status(404).send('Page introuvable')
	});

};
