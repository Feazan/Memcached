var express = require('express');
var mysql = require('mysql');
var app = express();

app.get('/', (req, res, next) => {
	res.send('Hello!');
});

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'hw7'
});

connection.connect();

connection.query('SELECT * FROM assists', function(error, results, fields) {
	if (error) throw error;
	console.log('The solution is: ', results);
});

app.listen(3000, (req, res, next) => {
	console.log('Server Started...');
});
