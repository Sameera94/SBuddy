'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BorrowSchema = new mongoose.Schema({
	bookID: String,
	userID: String,
    user: String,
	book: String,
    created: { type: Date, default: Date.now }
});



var Borrow = module.exports = mongoose.model('Borrow', BorrowSchema);

module.exports.newBorrow = function(newBorrow, callback){
    newBorrow.save(callback);
}

module.exports.getAllBorrows = function(callback){
	Borrow.find({},callback);
}