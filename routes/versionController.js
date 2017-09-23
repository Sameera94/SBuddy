var express = require("express");
var router  = express.Router();
var File    = require("../models/file");
var fsmonitor = require('fsmonitor');
var mysql = require('mysql');
var async     = require("async");
var path = require('path');

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'seo_buddy'
});

// var pool = mysql.createPool({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'root',
// 	database: 'seo_buddy',
// 	socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
// });

var getSubs = function(files, cb) {
	var selectedFiles = []
	async.forEach(files, function (file, callback) {
		pool.getConnection(function (err, connection) {
			connection.query("SELECT * FROM file_monitor_file_updates WHERE fileId=?",file.id, function (error, results, fields) {
				connection.release();
				if (error) {
					console.log("Error occured getting result...")
				}
				selectedFiles.push({
					file: file,
					sub: results
				});
				callback();
			});
		});
	}, function (err) {
		cb(selectedFiles);
	});
}

router.get('/getSubs', function (req, res) {
	pool.getConnection(function (err, connection) {
		var sql = mysql.format("select * from file_monitor_main ORDER BY id ASC");
		connection.query(sql, function (error, results, fields) {
			connection.release();
			if (error) {
				res.send(error);
			}
			getSubs(results, function(files){
				res.send(files);
			})
		});
	});
});






// router.get('/getAllFiles',function(req,res){
// 	File.getAllFiles(function(err, files){
// 		if(err) throw err;

// 		res.send(files);
// 	});
// });

// router.post('/addNewFile', function (req, res) {
	
// 	var newFile = new File({
// 		originaFileName      : req.body.originaFileName,
// 		originalFileLocation : req.body.originalFileLocation,
// 		projectName			 : req.body.projectName,
// 	});

// 	File.addNewFile(newFile,function (err,file) {
// 		if(err) throw err;
// 		res.send(file);
// 	});
// });

// router.post('/addNewVersion', function (req, res) {
	
// 	File.addNewVersion(req.body.file, req.body.vName, req.body.version, req.body.path, function (err,file) {
// 		if(err) throw err;
// 		res.send(file);
// 	});
// });

// /* File monitoring process */
// router.post('/startMonitor', function (req, res) {

// 	console.log("Project files monitoring started...")

// 	fsmonitor.watch(req.body.path, null, function(change) {
// 		console.log("Modified file: %j", change.modifiedFiles);
// 	});
// });

module.exports = router;