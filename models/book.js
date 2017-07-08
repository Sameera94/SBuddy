'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new mongoose.Schema({
	name: String,
    author: String,
    created: { type: Date, default: Date.now }
});



var Book = module.exports = mongoose.model('Book',BookSchema);

module.exports.createNewBook = function(newBook, callback){
    newBook.save(callback);
}

module.exports.getAllBooks = function(callback){
	Book.find({},callback);
}