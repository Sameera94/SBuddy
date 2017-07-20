var express   = require("express");
var router    = express.Router();
var JSFtp     = require("jsftp");
var async     = require("async");
var exec 	  = require('child_process').exec;
var nodemiral = require('nodemiral');
var mysql 	  = require('mysql');
var jsonfile  = require('jsonfile')

//Configurations
var baseUrl = "/home/sysadmin";
var ftp = null;

var pool = mysql.createPool({
	host: '172.17.0.4',
	user: 'root',
	password: 'root',
	database: 'mysql'
});

var session = nodemiral.session('10.52.209.6', {
	username: 'sysadmin', 
	password: '3college!'
});

router.post('/getFilesHeirachyOfGivenDirectory', function (req, res, next) {
	getFilesHeirachyOfGivenDirectory(req.body.path,function(results) {
		res.send(results);
	});
})

var getFilesHeirachyOfGivenDirectory = function (path,callback) {
	ftp.ls(path, function (err, res) {
		callback(res)
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

router.post('/downloadFolder', function (req, res, next) {

	var rawCommand  = 'zip -r ' + req.body.path+'.zip ' + req.body.path
	var zipFilePath = req.body.path + ".zip"
	var destinationPath = "/home/sameera/Desktop/SEO-downloads-loc/"



	// Executing shell scrit
						exec("sh /home/sameera/Desktop/Prageeth/Runner/MyApp/shellScript.sh", function (err, stdout, stderr) {
							console.log("Executed")
							res.send("success");
						});

/*
	//create zip file
	session.execute(rawCommand, function(err, code, logs) {		
		console.log(logs.stdout);
		console.log("Going to download file: "+zipFilePath+ " and save to: "+destinationPath);

        setTimeout(function() {
        	console.log("Start downloading...")
		    //download zip file
		 	//var newCmd = "sshpass -p 3college! scp sysadmin@10.52.209.6:"+req.body.path+".zip /home/sameera/Desktop/Research/Downloads/web.zip"
			var newCmd = "sshpass -p 3college! scp sysadmin@10.52.209.6:"+req.body.path+".zip /home/sameera/Desktop/SEO-downloads-loc/"+req.body.name+".zip"

			exec(newCmd, function (err, stdout, stderr) {
				console.log("Downloaded...")

				// CD into folder
//				exec("cd /home/sameera/Desktop/SEO-downloads-loc/", function (err, stdout, stderr) {
//					console.log("Current locatiion changed...")

					// unizip downloaded file
					exec("unzip /home/sameera/Desktop/SEO-downloads-loc/"+req.body.name+".zip -d /home/sameera/Desktop/SEO-downloads-loc/", function (err, stdout, stderr) {
						console.log("Stdout: "+stdout);
						console.log("Unziped finished...");

						//unzip /path/to/file.zip
				
						// Executing shell scrit
						exec("sh /home/sameera/Desktop/Prageeth/Runner/MyApp/shellScript.sh", function (err, stdout, stderr) {
							console.log("Executed")
							res.send("success");
						});
					});
//				});				
			});
		}, 5000);
	});
	*/
});

router.get('/getQueryData',function(req,res){
	console.log("came to getQueryData..")
	pool.getConnection(function (err, connection) {
		//var sql = mysql.format("SELECT * from general_log WHERE command_type = 'Query' AND argument NOT LIKE '%general_log%' AND argument NOT LIKE 'SET %' AND argument NOT LIKE 'SET CHARACTER%' AND argument NOT LIKE 'SHOW TABLE STATUS FROM%' AND argument NOT LIKE '%SELECT CURRENT_USER()%' AND argument NOT LIKE 'SELECT `PRIVILEGE_TYPE` FROM%' order by event_time DESC LIMIT 25");
		var sql = mysql.format("SELECT event_time, CAST(argument AS CHAR(1000) CHARACTER SET utf8) AS argument from general_log WHERE command_type = 'Query' AND argument NOT LIKE '%general_log%' AND argument NOT LIKE 'SET %' AND argument NOT LIKE 'SET CHARACTER%' AND argument NOT LIKE 'SHOW TABLE STATUS FROM%' AND argument NOT LIKE '%SELECT CURRENT_USER()%' AND argument NOT LIKE 'SELECT `PRIVILEGE_TYPE` FROM%' order by event_time DESC LIMIT 25")
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
