module.exports = function(app){

	//main page
	app.get('/', function(req, res){

		res.sendFile('app/index.html' , { root : __dirname});
	});

	//other pages
	app.use(function(req, res, next){
	
		res.setHeader('Content-Type', 'text/plain');
		res.status(404).send('Page introuvable')
	});

};
