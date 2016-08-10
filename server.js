var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var port = process.env.PORT || 8080; 

/**
 * Rest API's offered by server.
 * @module server
 */

/**
 * A script that configures the server
 * part.
 * @class server
 */

//configuration
app.use(express.static(__dirname + '/app'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({limit: '100mb', extended:true}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

//routes
require('./server/routes.js')(app);

//start app
app.listen(port);
console.log('magic happens on ' + port);
