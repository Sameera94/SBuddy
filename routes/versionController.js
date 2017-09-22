var express = require("express");
var router  = express.Router();
var File    = require("../models/file");
var fsmonitor = require('fsmonitor');

router.get('/getAllFiles',function(req,res){
	File.getAllFiles(function(err, files){
		if(err) throw err;

		res.send(files);
	});
});

router.post('/addNewFile', function (req, res) {
	
	var newFile = new File({
		originaFileName      : req.body.originaFileName,
		originalFileLocation : req.body.originalFileLocation,
		projectName			 : req.body.projectName,
	});

	File.addNewFile(newFile,function (err,file) {
		if(err) throw err;
		res.send(file);
	});
});

router.post('/addNewVersion', function (req, res) {
	
	File.addNewVersion(req.body.file, req.body.vName, req.body.version, req.body.path, function (err,file) {
		if(err) throw err;
		res.send(file);
	});
});

/* File monitoring process */
router.post('/startMonitor', function (req, res) {

	console.log("Project files monitoring started...")

	fsmonitor.watch(req.body.path, null, function(change) {
		console.log("Modified file: %j", change.modifiedFiles);
	});
});

module.exports = router;