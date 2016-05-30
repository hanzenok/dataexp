var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "maya_db"
});

connection.connect(function(err){
  if (err)
    throw err;
});

connection.query('SELECT * FROM test;', function(err, rows, fields){

	if (err) throw err;

	console.log('rows:');
	console.log(rows);
});

connection.end();