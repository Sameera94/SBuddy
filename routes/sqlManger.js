var express   = require("express");
var router    = express.Router();
var mysql 	  = require('mysql');
var async     = require("async");

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'seo_buddy'
});

var allQueryArray = []

var insertQuery = function(query,time,result,cb) {
	pool.getConnection(function (err, connection) {

		var values = {
			query	: query,
			time	: time,
			result	: result
		};

		connection.query('INSERT INTO dynamic_queries SET ?', values, function (error, results, fields) {
			connection.release();
			if (error) {
				res.send(error);
			}
			console.log("new record added to dynamic_queries")
			cb();
		});
	});
}

router.post('/insertNewQueryArray', function (req, res, next) {
	pool.getConnection(function (err, connection) {
		async.forEach(req.body.data, function (query, callback) {

			// insertQuery(query.argument, query.event_time, "", function(){
			// 	callback();
			// })
			

				var values = {
					query	: query.argument,
					time	: query.event_time,
					result	: ""
				};

				connection.query('INSERT INTO dynamic_queries SET ?', values, function (error, results, fields) {
					
					if (error) {
						res.send(error);
					}
					console.log("new record added to dynamic_queries")
					callback();
				});
			

		}, function (err) {
			connection.release();
			res.send("Done")
		});
	});
	
});







module.exports = router;