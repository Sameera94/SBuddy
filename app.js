'use strict';
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var routes = require('./routes/routes');
var connectionRoutes = require('./routes/connectionRoutes');
var shellRoutes = require('./routes/shellRoutes');
var sqlManager = require('./routes/sqlManger');

mongoose.connect("mongodb://localhost:27017/MTIT_Library");

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

app.use('/lbs', routes);
app.use('/connection', connectionRoutes);
app.use('/shell', shellRoutes);
app.use('/sql', sqlManager);

app.get('/', function (req, res) {
   res.sendfile('app/index.html');
});


/*************************
        Server
*************************/
app.listen(8090);
console.log("SEO Buddy running on port 8090");
module.exports = app;