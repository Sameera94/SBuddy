var express = require("express");
var router 	= express.Router();
var exec 	= require('child_process').exec;
var nodemiral = require('nodemiral');
var session = nodemiral.session('10.52.209.6', {username: 'sysadmin', password: '3college!'});
 
/*

// var ftp = new JSFtp({
// 	host: "10.52.209.6",
// 	port: 21,
// 	user: "sysadmin",
// 	pass: "3college!"
// });



*/




router.get('/test', function (req, res, next) {
	// exec('perl /Users/vchans5/Documents/ResearchStuff/MainApp/shell_scripts/test.pl', function(err, stdout, stderr){
	// 	res.send(stdout.toString('utf8'));
	// });

	exec('ls -l', 'sameera@192.168.8.102', function (err, stdout, stderr) {
  		res.send(stdout.toString('utf8'));
	});

});


router.get('/zipProjectFolder', function (req, res, next) {




	// session.execute('sh /home/sysadmin/shellscripts/test.sh', function(err, code, logs) {
	// 	console.log(logs.stdout);
	// });
	session.execute('zip -r /home/sysadmin/shellscripts/testfolder.zip /home/sysadmin/shellscripts/testfolder', function(err, code, logs) {
		console.log(logs.stdout);
	});
});




module.exports = router;