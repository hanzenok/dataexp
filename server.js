var express = require('express');
var app = express();
var port = process.env.PORT || 8080; 

//configuration
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

//routes
require('./app/routes.js')(app);

//start app
app.listen(port);
console.log('magic happens on ' + port);
