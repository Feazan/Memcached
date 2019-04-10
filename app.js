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

app.get('/hw7', (req, res, next) => {
	var club = req.query.club;
	var pos = req.query.pos;

	console.log('Club: ', club, 'Pos: ', pos);

	var query = 'SELECT * FROM assists WHERE Club = ' + club;
	console.log('Built Query: ', query);
	connection.query(query, function(error, results, fields) {
		if (error) throw error;
		console.log('The solution is: ', results);
	});
});

app.listen(3000, (req, res, next) => {
	console.log('Server Started...');
});
