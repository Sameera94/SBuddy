var express   = require("express");
var router    = express.Router();
var JSFtp     = require("jsftp");
var async     = require("async");
var exec 	  = require('child_process').exec;
var nodemiral = require('nodemiral');

//Configurations


// var ftp = new JSFtp({
// 	host: "192.168.8.102",
// 	port: 21,
// 	user: "sameera",
// 	pass: "sameera"
// });



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

//Routes
// router.get('/test', function (req, res) {
// 	var files = [];
// 	ftp.ls("/home/sysadmin/SFC/NodeServerAccount", function (err, res) {

// 		res.forEach(function (file) {
// 			console.log(file);
// 			files.push(file.name);
// 		});
// 		res.send(files);
// 	});
// });

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

// router.get('/downloadFilesFromRemoteServer', function (req, res) {
// 	ftp.get(baseUrl+"/app.js", '/Users/vchans5/Desktop/07:04/app.js', function (hadErr) {
// 		if (hadErr)
// 			console.error('There was an error retrieving the file.');
// 		else
// 			console.log('File copied successfully!');
// 	});
// });

// router.get('/executeRawCommand', function (req, res) {
// 	ftp.raw("ls", baseUrl, function(err, data) {
    	
// 		if (err) return console.error(err);
//     	console.log(data.text); // Show the FTP response text to the user 
// 		console.log("--------------");
//     	console.log(data.code); // Show the FTP response code to the user 
// 	});
// });

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

	//console.log(req.body.path)
	// session.execute('sh /home/sysadmin/shellscripts/test.sh', function(err, code, logs) {
	// 	console.log(logs.stdout);
	// });
	// session.execute('zip -r /home/sysadmin/shellscripts/testfolder.zip /home/sysadmin/shellscripts/testfolder', function(err, code, logs) {
	// 	console.log(logs.stdout);
	// });
});


module.exports = router;