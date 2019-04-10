var express = require('express');
var mysql = require('mysql');
var Memcached = require('memcached');

var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
	res.render('home');
});

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'hw7'
});

connection.connect();
var memcached = new Memcached('localhost:11211');

app.get('/hw7', (req, res, next) => {
	var club = req.query.club;
	var pos = req.query.pos;
	if (!club || !pos) res.return({ status: 'error', error: 'No query specified' });

	console.log('Club: ', club, 'Pos: ', pos);

	var query = 'SELECT * FROM assists WHERE Club = ' + "'" + club + "' AND Pos = " + "'" + pos + "' ORDER BY A DESC";
	console.log('Built Query: ', query);
	memcached.get('foo', function(err, data) {
		console.log('TESTSTSETSET: ', data);
	});

	connection.query(query, function(err, results) {
		if (err) throw error;
		// cache the results
		memcached.set('foo', results, 10, function(err) {
			if (err) console.log(err);
		});

		// Compute average assists
		var avg = 0;
		for (var i = 0; i < results.length; i++) {
			avg += results[i].A;
		}
		avg /= results.length;

		var tie = 0;
		if (results[0].A === results[1].A) {
			if (results[0].GS > results[1].GS) {
				tie = 0;
			} else {
				tie = 1;
			}
		}

		var response = {
			club: club,
			pos: pos,
			max_assists: results[tie].A,
			player: results[0].Player,
			avg_assists: avg
		};

		res.send(response);
	});
});

app.listen(3000, (req, res, next) => {
	console.log('Server Started...');
});
