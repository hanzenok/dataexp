var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var port = process.env.PORT || 8080; 

//configuration
app.use(express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

//routes
require('./server/routes.js')(app);

//start app
app.listen(port);
console.log('magic happens on ' + port);
