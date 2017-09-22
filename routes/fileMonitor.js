var express = require("express");
var router  = express.Router();
var fsmonitor = require('fsmonitor');
var mysql 	  = require('mysql');
var path = require('path');
var fs = require('fs');
var shortid = require('shortid');


var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'seo_buddy',
	socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
});

var backupFileLocation = "/Users/vchans5/Desktop/09-21/Backups/"
var projectLocation = "/Users/vchans5/Desktop/09-21/EditingFolder/"

/* File monitoring process */
router.post('/startMonitor', function (req, res) {

	console.log("* * * Project files monitoring started! * * *")

	fsmonitor.watch(req.body.path, null, function(change) {
		console.log("Modified file: %j", change.modifiedFiles);
		insertNewFileIntoDB(path.basename(change.modifiedFiles[0]), change.modifiedFiles[0], "", shortid.generate())
	});
});

var insertNewFileIntoDB = function(fileName, originalPath, originalFile, randomFileName) {

	fs.writeFileSync(backupFileLocation+randomFileName, fs.readFileSync(projectLocation + originalPath));

	checkFileExist(originalPath, function(status,results){

		if(status == false) {
			
			// File not exist, save in file_monitor_main table
			pool.getConnection(function (err, connection) {
				
				var values = {
					file_name: fileName,
					original_path: originalPath,
					original_file: originalFile
				};
		
				connection.query('INSERT INTO file_monitor_main SET ?', values, function (error, results, fields) {
					connection.release();
					if (error) {
						console.log(error)
					}

					insertNewFileUpdate(results.insertId, randomFileName, backupFileLocation+randomFileName)
				});
			});
			
		} else {
			// Save update in DB
			insertNewFileUpdate(results['id'], randomFileName, backupFileLocation+randomFileName)
		}
	});	
}

var checkFileExist = function(originalPath, callback) {

	pool.getConnection(function (err, connection) {
		
		var sql = mysql.format("select id from file_monitor_main WHERE original_path = ?", originalPath);
		
		connection.query(sql, function (error, results, fields) {
			
			if (results.length == 0) {
				callback(false,results[0]);
			} else {
				callback(true,results[0]);
			}
		});
	});
}

var insertNewFileUpdate = function(fileId, randomName, location) {
	pool.getConnection(function (err, connection) {
		
		var values = {
			fileId : fileId,
			randomName: randomName,
			location : location
		};

		connection.query('INSERT INTO file_monitor_file_updates SET ?', values, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log(error)
			}
		});
	});
}


router.post('/testdb', function (req, res) {

	// fs.writeFiles(file, content, 'utf-8', function (err) {
	// 	if (err) {
	// 	  response.send("failed to save");
	// 	} else {
	// 	  response.send("succeeded in saving");
	// 	}
//	var randomName = 

	fs.writeFileSync(backupFileLocation+shortid.generate(), fs.readFileSync("/Users/vchans5/Desktop/09-21/EditingFolder/test2.txt"), 'utf-8', function (err) {
		console.log("done")
	});

// 	pool.getConnection(function (err, connection) {
		
// 		var path = "test1.txt";

// 		var sql = mysql.format("select * from file_monitor_main WHERE original_path = ?", path);
		
// 		connection.query(sql, function (error, results, fields) {
// 			var arr = JSON.stringify(results)

// 			console.log(arr.count)

// 			if (arr.length == 0) {
// 				res.send(true);
// 			} else {
// 				res.send(false);
// 			}
// 		});
// 	});
});

module.exports = router;