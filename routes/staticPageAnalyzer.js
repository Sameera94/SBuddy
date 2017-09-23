var express = require("express");
var router  = express.Router();
var fs 		= require('fs')
var async   = require("async");
var path 	= require('path');
var mysql 	= require('mysql');

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'seo_buddy'
});

router.post('/replaceStaticContents', function (req, res) {

	console.log(".........................................");
	console.log("Received fileName :"+req.body.fileName);
	console.log("Received old string : "+req.body.searchString);
	console.log("Received new string :"+req.body.newString);
	console.log("Received new description :"+req.body.description);
	console.log(".........................................");
	
	var fileUrl = "/home/sameera/Desktop/dewmi/sampleHtml/"+req.body.fileName+".html";

	// Check file exist or not before read
	if (fs.existsSync(fileUrl)) {

		// Read the file and get the contents
		fs.readFile(fileUrl, 'utf8', function (err,data) {
			if (err) {
				console.log(err);
			}
			console.log("File contents sucessfully read..")

			// Find the searchString in the file content
			if (data.indexOf(req.body.searchString) >= 0) { 
				console.log("Searching string is in the file...")
				
				// Write updated contents back to the original file
				fs.writeFile(fileUrl, data.replace(req.body.searchString, req.body.newString), function (err) {
					if (err) {
						console.log(err);
					} 
					console.log(fileUrl+ " file contents changed!");

					// Save details in DB
					saveFileUpdateContents(fileUrl, req.body.searchString, req.body.newString, req.body.description)
					
					res.send({
						status: true,
						response: "contents succesfully updated",
						error : ""
					});
				});
			} else { 
				console.log("Searching string is not available in the file...")
				res.send({
					status: false,
					response: "failed",
					error : "Cannot find the search string in the file"
				});
			}
		});
	} else {
		console.log("File, "+ req.body.fileName +" does not exist!");
		res.send({
			status: false,
			response: "failed",
			error : "File, "+ req.body.fileName +" does not exist!"
		});
	}
});


// POST: Params = udateId (Update id) 

router.post('/restoreStaticContents', function (req, res) {

	console.log("Restoring static content...");
	console.log("Received update record id: " + req.body.udateId);

	pool.getConnection(function (err, connection) {
		var sql = mysql.format("select * from file_replace_info WHERE id = ?", req.body.udateId);
		
		connection.query(sql, function (error, results, fields) {
			 
			if(results.length == 1) {

				// Check file exist or not before read
				if (fs.existsSync(results[0].filePath)) {

					// Read the file and get the contents
					fs.readFile(results[0].filePath, 'utf8', function (err,data) {
						if (err) {
							console.log(err);
						}
						console.log("File contents sucessfully read..")

						// Find the searchString in the file content
						if (data.indexOf(results[0].newContent) >= 0) { 
							console.log("Searching string is in the file...")
							
							// Write updated contents back to the original file
							fs.writeFile(results[0].filePath, data.replace(results[0].newContent, results[0].originalContent), function (err) {
								if (err) {
									console.log(err);
								} 
								console.log(results[0].filePath+ " file contents changed!");

								res.send({
									status: true,
									response: "contents succesfully updated",
									error : ""
								});
							});
						} else { 
							console.log("Searching string is not available in the file...")
							res.send({
								status: false,
								response: "failed",
								error : "Cannot find the search string in the file"
							});
						}
					});
				} else {
					console.log("File, "+ req.body.fileName +" does not exist!");
					res.send({
						status: false,
						response: "failed",
						error : "File, "+ req.body.fileName +" does not exist!"
					});
				}
				
			} else {
				console.log("Restore failed")
				res.send("failed")
			}
		});
	});
});



// Save file update details into DB
 
var saveFileUpdateContents = function(filePath, originalContent, newContent, replacedBy) {

	pool.getConnection(function (err, connection) {
		
		var values = {
			filename: path.basename(filePath),
			filePath: filePath,
			originalContent: originalContent,
			newContent: newContent,
			replacedBy: replacedBy
		};

		connection.query('INSERT INTO file_replace_info SET ?', values, function (error, results, fields) {
			connection.release();
			if (error) {
				console.log(error)
			}
			console.log("New file update record saved!")
		});
	});
};


module.exports = router;