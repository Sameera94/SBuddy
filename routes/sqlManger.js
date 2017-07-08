var express   = require("express");
var router    = express.Router();
var mysql 	  = require('mysql');
var async     = require("async");

var pool2 = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'seo_buddy'
});

var pool1 = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'mysql'
});

var pool3 = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'node_db'
});

var clearDynamicQueriesTable = function(callback) {
	pool2.getConnection(function (err, connection) {
		var sql = mysql.format("DELETE FROM dynamic_queries");

		connection.query(sql, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log(error)
			}
			callback()
		});
	});
}

var clearQuniqueQueriesTable = function(callback) {
	pool2.getConnection(function (err, connection) {
		var sql = mysql.format("DELETE FROM unique_queries");

		connection.query(sql, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log(error)
			}
			callback()
		});
	});
}

//This will return only select queries
var getAllQueriesFromGenaralSqlTable = function(callback) {
	pool1.getConnection(function (err, connection) {

		var sql = mysql.format("SELECT DISTINCT(argument) from general_log WHERE command_type = 'Query' AND argument LIKE 'Select%' AND argument NOT LIKE '%tracking_active FROM%' AND argument NOT LIKE '%MAX(version)%' AND argument NOT LIKE '%phpmyadmin%' AND argument NOT LIKE '%information_schema%' AND argument NOT LIKE '%seo_buddy%' AND argument NOT LIKE '%general_log%' AND argument NOT LIKE 'SELECT @@%' AND argument NOT LIKE '%executeMysqlQuery%' order by event_time DESC");
		//"SELECT DISTINCT(argument) from general_log WHERE command_type = 'Query' AND argument NOT LIKE '%general_log%' AND argument NOT LIKE 'SET %' AND argument NOT LIKE 'SET CHARACTER%' AND argument NOT LIKE 'SHOW TABLE STATUS FROM%' AND argument NOT LIKE '%SELECT CURRENT_USER()%' AND argument NOT LIKE 'SELECT `PRIVILEGE_TYPE` FROM%' order by event_time DESC"

		connection.query(sql, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log(error);
			}
			callback(results)
		});
	});
}

var getAllQueriesFromDynamicTable = function(callback) {
	pool2.getConnection(function (err, connection) {

		var sql = mysql.format("SELECT * FROM dynamic_queries");
		
		connection.query(sql, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log(error)
			}
			callback(results)
		});
	});
}

var inserRecordIntoDynamicQueryTable = function(data,callback){
	pool2.getConnection(function (err, connection) {

		var values = {
			query	: data
		};

		connection.query('INSERT INTO dynamic_queries SET ?', values, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log(error)
			}
			callback();
		});
	});
}

var executeMysqlQuery = function(query,callback){
	pool3.getConnection(function (err, connection) {

		connection.query(query, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log("Error occured when executing query...");
			}
			callback(query,results);
		});
	});
}

var inserRecordIntoUniqueQueryTable = function(query,result,callback){
	pool2.getConnection(function (err, connection) {

		var values = {
			query	: query,
			result  : JSON.stringify(result)
		};

		connection.query('INSERT INTO unique_queries SET ?', values, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log("Error occured when inserting result...")
			}
			callback();
		});
	});
}


router.get('/startAnalyzer', function (req, res, next) {

	// Delete all records in dynamic_queries table
	clearDynamicQueriesTable(function(){
		// Delete all records in unique_queries table
		clearQuniqueQueriesTable(function(){
			//get all records from genaral_sql_log
			getAllQueriesFromGenaralSqlTable(function(queries){
				// Insert into dynamic table
				async.forEach(queries, function (record, callback) {
					if (record.argument != null) {
						inserRecordIntoDynamicQueryTable(record.argument, function(){
							callback();
						})
					} else {
						console.log("record is null")
						callback();
					}
				}, function (err) {
					if(err){
						console.log(err)
					}
					// Get All Quesries in Dynamic tablle one by one
					getAllQueriesFromDynamicTable(function(records){
						async.forEach(records, function (record, callback) {
							// Execute the query
							
							executeMysqlQuery(record.query,function(executedQuery, result){
								// Insert Query and Result inot Unique table
								inserRecordIntoUniqueQueryTable(executedQuery, result, function(){
									callback();
								})
							})
							
							//callback();
						}, function (err) {
							res.send("All Done....")
						});
					})
				});
			});	
		})
	});
});











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