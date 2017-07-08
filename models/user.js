'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
	fname: String,
    lname: String,
	phone: String,
	email: String,
	address: String,
    created: { type: Date, default: Date.now }
});

var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createNewUser = function(newUser, callback){
    newUser.save(callback);
}

module.exports.getAllUsers = function(callback){
	User.find({},callback);
}