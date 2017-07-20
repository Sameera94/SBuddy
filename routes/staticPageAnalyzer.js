var express = require("express");
var router  = express.Router();
var fs 		= require('fs')
var async   = require("async");
var path 	= require('path'); 

router.post('/replaceStaticContents', function (req, res) {

	console.log(".........................................");
	console.log("Received fileName :"+req.body.fileName);
	console.log("Received old string : "+req.body.searchString);
	console.log("Received new string :"+req.body.newString);
	
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

module.exports = router;