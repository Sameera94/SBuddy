var express   = require("express");
var router    = express.Router();
var mysql 	  = require('mysql');

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'seo_buddy'
});



router.post('/insertNewQuery', function (req, res, next) {

	pool.getConnection(function (err, connection) {

		var values = {
			query	: req.body.query,
			time	: req.body.time,
			result	: req.body.result
		};

		connection.query('INSERT INTO dynamic_queries SET ?', values, function (error, results, fields) {
			connection.release();
			if (error) {
				res.send(error);
			}

			res.send(results);
		});
	});
});

module.exports = router;