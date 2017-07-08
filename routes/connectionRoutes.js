var express   = require("express");
var router    = express.Router();
var JSFtp     = require("jsftp");
var async     = require("async");
var exec 	  = require('child_process').exec;
var nodemiral = require('nodemiral');
var mysql 	  = require('mysql');

//Configurations


// var ftp = new JSFtp({
// 	host: "192.168.8.102",
// 	port: 21,
// 	user: "sameera",
// 	pass: "sameera"
// });

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'mysql'
});

var session = nodemiral.session('10.52.209.6', {
	username: 'sysadmin', 
	password: '3college!'
});

var baseUrl = "/home/sysadmin/SFC/NodeServerAccount";
//var baseUrl = "/home/sameera/Desktop/SFCUpdatedDesktop/NodeServerAccount";

var ftp = null;

//Custom Functions
var getFileArray = function (callback) {
	var files = [];
	var index = 0;

	ftp.ls(baseUrl, function (err, res) {
		async.forEach(res, function (parent, callback) {

			files.push({
				label: parent.name,
				id: "role3",
				path: baseUrl + "/" + parent.name,
				children: []
			});

			ftp.ls(baseUrl + "/" + parent.name, function (err, res) {

				async.forEach(res, function (child, cb) {
					if (child.name != parent.name) {
						files[index].children.push({ label: child.name, id: "role121", children: [] })
						cb();
					} else {
						cb();
					}
				}, function (err) {
					callback();
					index = index + 1;
				});
			});
		}, function (err) {
			callback(files)
		});
	});
}


router.post('/setupConnection', function (req, res) {
	
	ftp = new JSFtp({
		host: req.body.ip,
		port: 21,
		user: req.body.username,
		pass: req.body.password
	});
});
	
	
router.get('/getTreeStructureFromRemoteServer', function (req, res) {
	getFileArray(function (results) {
		res.send(results);
	});
});


router.post('/downloadFolder', function (req, res, next) {

	var rawCommand  = 'zip -r ' + req.body.path+'.zip ' + req.body.path
	var zipFilePath = req.body.path + ".zip"
	var destinationPath = "/Users/vchans5/Documents/ResearchStuff/MainApp/downloads/web.zip"

	//create zip file
	session.execute(rawCommand, function(err, code, logs) {
		
		console.log(logs.stdout);

		//download zip file
		ftp.get(zipFilePath, destinationPath, function (err) {
			if (err){
				console.error('There was an error retrieving the file.');
				res.send("failed");
			} else {
				console.log('File copied successfully!');
				//TODO: Remove zip file from server
				res.send("success");			
			}
		});
	});

});

router.get('/getQueryData',function(req,res){
	pool.getConnection(function (err, connection) {

		var sql = mysql.format("select * from general_log WHERE command_type = 'Query'");

		connection.query(sql, function (error, results, fields) {
			connection.release();
			if (error) {
				res.send(error);
			}

			res.send(results);
		});
	});
});

module.exports = router;