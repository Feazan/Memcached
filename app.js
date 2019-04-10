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

	var query = 'SELECT * FROM assists WHERE Club = ' + "'" + club + "' AND Pos = " + "'" + pos + "' ORDER BY A DESC";
	console.log('Built Query: ', query);
	connection.query(query, function(err, results) {
		if (err) throw error;

		var avg = 0;
		for (var i = 0; i < results.length; i++) {
			avg += results[i].A;
		}
		avg /= results.length;
		var response = { club: club, pos: pos, max_assists: results[0].A, player: results[0].Player, avg_assists: avg };

		res.send(response);
	});
});

app.listen(3000, (req, res, next) => {
	console.log('Server Started...');
});
