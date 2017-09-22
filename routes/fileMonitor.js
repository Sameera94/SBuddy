var express = require("express");
var router  = express.Router();
var fsmonitor = require('fsmonitor');
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');
var shortid = require('shortid');
var exec = require('child_process').exec;

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'seo_buddy',
	socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
});

var homePath = "/Users/vchans5/Desktop/09-21/SBuddy/VersionController/"
var projectLocation = ""
var projectName = ""

var backupFileLocation = homePath + "Backups/"
var originalBackupFileLocation = homePath + "OriginalBackup/"

/* File monitoring process */
router.post('/startMonitor', function (req, res) {
	
	console.log("\n****************************************")
	console.log("****** Version Controller Started ******")
	console.log("****************************************\n")

	// Start the monitor
	console.log("Project files monitoring started..")
	fsmonitor.watch(req.body.path, null, function(change) {
		console.log("Modified file: %j", change.modifiedFiles);
		var originalFile = originalBackupFileLocation + projectName + "_Backup/" + projectName + "/" + change.modifiedFiles[0];
		insertNewFileIntoDB(path.basename(change.modifiedFiles[0]), change.modifiedFiles[0], originalFile, shortid.generate())
	});

	// Save project name and location
	projectLocation = req.body.path;
	projectName = req.body.projectName;

	// Create new folder in OriginalBackup for the project
	exec("mkdir " + originalBackupFileLocation + projectName + "_Backup", function (err, stdout, stderr) {
		console.log("Create new folder in OriginalBackup for the project")
		console.log(stderr)

		// Copy project into that folder
		exec("cp -r "+ projectLocation.slice(0,-1)+ " " + originalBackupFileLocation + projectName + "_Backup", function (err, stdout, stderr) {
			console.log("Copy project into that folder")
			console.log(stderr)
		});
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
});

module.exports = router;