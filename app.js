'use strict';
var express			= require("express");
var cors 			= require("cors");
var bodyParser 		= require("body-parser");
var app 			= express();
var mongoose 		= require('mongoose');
var cookieParser 	= require('cookie-parser');
var session 		= require('express-session');
var connectionRoutes= require('./routes/connectionRoutes');
var shellRoutes 	= require('./routes/shellRoutes');
var sqlManager		= require('./routes/sqlManger');
var versionManager  = require('./routes/versionController');
var pageAnalyzer    = require('./routes/staticPageAnalyzer');

mongoose.connect("mongodb://localhost:27017/SEO_Buddy");

/*************************
     Configurations
*************************/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
	next();
});
app.use(express.static("./app"));
app.use(cors());
app.use(cookieParser());

/*************************
        Routes
*************************/

//app.use('/connection', connectionRoutes);
//app.use('/shell', shellRoutes);
//app.use('/sql', sqlManager);
//app.use('/version', versionManager);
app.use('/static', pageAnalyzer);

app.get('/', function (req, res) {
   res.sendfile('app/index.html');
});

/*************************
        Server
*************************/
app.listen(8090);
console.log("SEO Buddy running on port 8090");
module.exports = app;