var express   = require("express");
var router    = express.Router();
var JSFtp     = require("jsftp");
var async     = require("async");
var exec 	  = require('child_process').exec;
var nodemiral = require('nodemiral');
var mysql 	  = require('mysql');
var jsonfile  = require('jsonfile')

//Configurations

// var ftp = new JSFtp({
// 	host: "192.168.8.102",
// 	port: 21,
// 	user: "sameera",
// 	pass: "sameera"
// });

// var easyftp = new EasyFtp();
// easyftp.connect(config);	

// var config = {
//     host: '10.52.209.6',
//     port: 21,
//     username: 'sysadmin',
//     password: '3college!'
// };


// var simpleftp = new FTP(config);



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

var baseUrl = "/home/sysadmin";
var ftp = null;


router.get('/testtest', function (req, res, next) {
	
	// Upload SEO_Proxy
	exec("sshpass -p 3college! scp /Users/vchans5/Desktop/07-13/SBuddy/SEO_Proxy.zip sysadmin@10.52.209.6:/home/sysadmin", function (err, stdout, stderr) {
		console.log("\n* * * * * Uploading SEO_Proxy * * * * *")
		console.log("stdout: "+stdout);
		console.log("stderr: "+stderr);
		if(err){
			console.log(err)
		}

		// Unzip SEO_Proxy.zip
		session.execute("unzip /home/sysadmin/SEO_Proxy.zip", function(err, code, logs) {
			console.log("\n* * * * * Unziping SEO_Proxy * * * * *")
			console.log("stdout: "+logs.stdout);
			console.log("stderr: "+logs.stderr);
			if(err){
				console.log(err)
			}

			// Run SEO_Proxy
			session.execute("node /home/sysadmin/SEO_Proxy/index.js", function(err, code, logs) {
				console.log("\n* * * * * Executing SEO_Proxy * * * * *")
				console.log("stdout: "+logs.stdout);
				console.log("stderr: "+logs.stderr);
				if(err){
					console.log(err)
				}

				// Download the tree.json file 
				exec("sshpass -p 3college! scp sysadmin@10.52.209.6:/home/sysadmin/SEO_Proxy/tree.json /Users/vchans5/Desktop/07-13/SBuddy/downloads/tree.json", function (err, stdout, stderr) {
					console.log("\n* * * * * Downloading tree.json * * * * *")
					console.log("stdout: "+stdout);
					console.log("stderr: "+stderr);
					if(err){
						console.log(err)
					}

					// Read tree.json and send object array
					jsonfile.readFile("/Users/vchans5/Desktop/07-13/SBuddy/downloads/tree.json", function(err, obj) {
						console.log("\n* * * * * Read tree.json * * * * *")
						if(err){
							console.log(err)
						}

						res.send(obj);
					});
				});
			});
		});
	});
	
	/*

	//This is tested
	exec("node /Users/vchans5/Desktop/07-13/SBuddy/SEO_Proxy/index.js", function (err, stdout, stderr) {
		
		//res.send("success");
		console.log(stdout)
		console.log(stderr)
		
		jsonfile.readFile("/Users/vchans5/Desktop/07-13/SBuddy/SEO_Proxy/tree.json", function(err, obj) {
			res.send(obj);
		});
	});


	session.execute("sshpass -p 3college! scp /Users/vchans5/Desktop/07-13/SBuddy/SEO_Proxy.zip sysadmin@10.52.209.6:/home/sysadmin", function(err, code, logs) {
		console.log("\n* * * * * Uploading SEO_Proxy * * * * *")
		console.log("stdout: "+logs.stdout);
		console.log("stderr: "+logs.stderr);	
		if(err){
			console.log(err)
		}
	*/
});






router.post('/getFilesHeirachyOfGivenDirectory', function (req, res, next) {

	getFilesHeirachyOfGivenDirectory(req.body.path,function(results) {
		res.send(results);
	});
})

var getFilesHeirachyOfGivenDirectory = function (path,callback) {
	
	var files = [];
	var index = 0;

	ftp.ls(path, function (err, res) {
		
		callback(res)
		/*
		async.forEach(res, function (parent, callback) {

			console.log("----------------------------------")
			console.log(parent)
			console.log("----------------------------------")

			ftp.ls(baseUrl + "/" + parent.name, function (err, res) {
				if(res.length > 1){
					files.push({
						label: parent.name,
						id: "role3",
						path: baseUrl + "/" + parent.name,
						children: [
							{ label: "test", id: "role121", children: [] }
						]
					});
					callback();
				} else {
					files.push({
						label: parent.name,
						id: "role3",
						path: baseUrl + "/" + parent.name,
						children: []
					});
					callback();
				}
			});

			// ftp.ls(baseUrl + "/" + parent.name, function (err, res) {

			// 	async.forEach(res, function (child, cb) {
			// 		if (child.name != parent.name) {
			// 			files[index].children.push({ label: child.name, id: "role121", children: [] })
			// 			cb();
			// 		} else {
			// 			cb();
			// 		}
			// 	}, function (err) {
			// 		callback();
			// 		index = index + 1;
			// 	});
			// });


		}, function (err) {
			callback(files)
		});
		*/
	});
}













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
	var destinationPath = "/home/sameera/Desktop/Research/Downloads/BlogsWeb.zip"

	//create zip file
	session.execute(rawCommand, function(err, code, logs) {		
		console.log(logs.stdout);
		console.log("Going to download file: "+zipFilePath+ " and save to: "+destinationPath);

        setTimeout(function() {
        	console.log("Start downloading...")
		    //download zip file
		    /*
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
			*/
			//var cmd = "sshpass -p 3college! scp sysadmin@10.52.209.6:/home/sysadmin/BlogsWeb.zip /home/sameera/Desktop/Research/Downloads/BlogsWeb.zip"

		 	var newCmd = "sshpass -p 3college! scp sysadmin@10.52.209.6:"+req.body.path+".zip /home/sameera/Desktop/Research/Downloads/web.zip"

			exec(newCmd, function (err, stdout, stderr) {
		  		res.send("success");
			});

		}, 5000);
	});
});

router.get('/getQueryData',function(req,res){
	pool.getConnection(function (err, connection) {

		var sql = mysql.format("SELECT * from general_log WHERE command_type = 'Query' AND argument NOT LIKE '%general_log%' AND argument NOT LIKE 'SET %' AND argument NOT LIKE 'SET CHARACTER%' AND argument NOT LIKE 'SHOW TABLE STATUS FROM%' AND argument NOT LIKE '%SELECT CURRENT_USER()%' AND argument NOT LIKE 'SELECT `PRIVILEGE_TYPE` FROM%' order by event_time DESC LIMIT 25");

		connection.query(sql, function (error, results, fields) {
			connection.release();
			if (error) {
				res.send(error);
			}
			res.send(results);
		});
	});
});


router.get('/easy',function(req,res){

	var cmd = "sshpass -p 3college! scp sysadmin@10.52.209.6:/home/sysadmin/BlogsWeb.zip /home/sameera/Desktop/Research/Downloads/BlogsWeb.zip"

	exec(cmd, function (err, stdout, stderr) {
  		res.send(stdout.toString('utf8'));
	});
})

module.exports = router;