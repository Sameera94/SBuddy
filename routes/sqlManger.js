var express   = require("express");
var router    = express.Router();
var mysql 	  = require('mysql');
var async     = require("async");

var pool2 = mysql.createPool({
	host: 'localhost',
	user: 'root',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
	password: 'root',
	database: 'seo_buddy'
});

var pool1 = mysql.createPool({
	host: 'localhost',
	user: 'root',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
	password: 'root',
	database: 'mysql'
});

var pool3 = mysql.createPool({
	host: 'localhost',
	user: 'root',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
	password: 'root',
	database: 'node_db'
});

var pool4 = mysql.createPool({
	host: 'localhost',
	user: 'root',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
	password: 'root',
	database: 'information_schema'
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

var getAllQueriesFromUniqueTable = function(callback) {
	pool2.getConnection(function (err, connection) {

		var sql = mysql.format("SELECT * FROM unique_queries");
		
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



var extractTableNames = function(resultsArray,tables,callback) {
	var selectedTables = []
	async.forEach(resultsArray, function (result, callback) {
		var query = result.query;
		async.forEach(tables, function (table, cb) {
			if(query.indexOf(table.table_name) > -1) {
				selectedTables.push(table.table_name);
				cb();
			} else {
				cb();
			}
		}, function (err) {
			callback();
		});
	}, function (err) {
		callback(selectedTables);
	});
}

var getAllTableNamesFromDB = function(callback){
	pool4.getConnection(function (err, connection) {
		connection.query("SELECT table_name FROM tables WHERE table_schema=?",["node_db"], function (error, results, fields) {
			connection.release();
			if (error) {
				console.log("Error occured getting result...")
			}
			callback(results);
		});
	});
}

var getUniqueArray = function(array, callback){

    var uniqueNames = []

    async.forEach(array, function (name, cb) {
        var isAvailable = false
        async.forEach(uniqueNames, function (uniqueName, callback) {
            if (uniqueName == name ){
                isAvailable = true
                callback()
            } else {
                callback()
            }
        }, function (err) {
            console.log(isAvailable)
            if(isAvailable == false){
                uniqueNames.push(name)
                cb()
            } else {
                cb()
            }
        });
    }, function (err) {
        callback(uniqueNames);      
    });
}


var findString = function(searchingString, callback) {
	var resultsArray = []
	getAllTableNamesFromDB(function(tables){
		getAllQueriesFromUniqueTable(function(records){
			async.forEach(records, function (record, callback) {

				var recordData = record.result;
				var searchString = searchingString;
				
				if(recordData.indexOf(searchString) > -1) {
					resultsArray.push(record);
					callback();
				} else {
					callback();
				}
			}, function (err) {
				extractTableNames(resultsArray,tables,function(selectedTables){
					getUniqueArray(selectedTables, function(result){
						callback(result);
					})
				});
			});
		});
	})
}

/*
	This route expects search string as "req.body.searchString"
	Returns True or False
*/	
router.post('/isReplacePosible', function (req, res, next) {
	findString(req.body.searchString, function(arr){
		if(arr.length > 0){
			res.send("true")
		} else {
			res.send("false")
		}
	});
});

var replaceStringInATable = function(oldString, newString, columns, tbl, callback) {
	var updateRecords = []
	pool3.getConnection(function (err, connection) {
		connection.query("SELECT * FROM ??",[tbl], function (error, results, fields) {
			connection.release();
			if (error) {
				console.log("Error occured getting resultssss...")
			}

			async.forEach(results, function (record, callback) {
				
				async.forEach(columns, function (column, cb) {
					if(record[column] == oldString){
						updateRecords.push({
							"id": record[columns[0]],
							"index_column": columns[0],
							"column": column,
							"value": newString,
							"table": tbl
						})
					}
					cb();
				}, function (err) {
					callback()
				});
			}, function (err) {
				callback(updateRecords)
			});
		});
	});
}

var getColumsFromTheTable = function(table,callback) {
	var colums = []
	pool3.getConnection(function (err, connection) {
		connection.query("SHOW COLUMNS FROM ??",[table], function (error, results, fields) {
			connection.release();
			if (error) {
				console.log("Error occured getting result...")
			}
			
			async.forEach(results, function (record, callback) {
				colums.push(record.Field);
				callback();
			}, function (err) {
				callback(colums)
			});
		});
	});
}

var replaceDataTable = function(array, callback){
	async.forEach(array, function (rec, callback) {
		var id = rec["id"]
		var column = rec["column"]
		var table = rec["table"]
		var value = rec["value"]
		var index_column = rec["index_column"]

		pool3.getConnection(function (err, connection) {
		 	connection.query("UPDATE ?? SET ?? = ? WHERE ?? = ?", [table,column,value, index_column,id], function (error, results, fields) {
				if(error){
					console.log(error);
				}
				callback();
		 	});
		});
	}, function (err) {
		callback("true")
	});
}

router.post('/replaceString', function (req, res, next) {
	var oldString = req.body.searchString;
	var newString = req.body.newString;	
	
	
	findString(req.body.searchString, function(arr){
		if(arr.length > 0){
			if(arr.length == 1){
				getColumsFromTheTable(arr[0],function(columns){
					replaceStringInATable(oldString,newString,columns,arr[0],function(result){
						console.log(result)
						replaceDataTable(result,function(result){
							res.send(result)
						});
					})
				})
			} else {
				res.send("Failed, There more than one tablles!");
			}
		} else {
			res.send("false")
		}
	});
});


router.get('/cleanGenaralLogs', function (req, res, next) {
	pool1.getConnection(function (err, connection) {
		var sql = mysql.format("DELETE FROM general_log");

		connection.query(sql, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log(error)
			}
			res.send("done");
		});
	});
});


module.exports = router;