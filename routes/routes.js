var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var User = require("../models/user");
var Borrow = require("../models/borrow");

router.post('/createBook', function (req, res) {
	
	var newBook = new Book({
		name 	: req.body.name,
		author  : req.body.author
	});

	Book.createNewBook(newBook,function (err,book) {
		if(err) throw err;

		res.send(book);
	});
});

router.post('/getAllBooks', function (req, res) {
	
	Book.getAllBooks(function(err,books){
 		if(err) throw err;
		 
 		res.send(books);
 	});
});

router.post('/createUser', function (req, res) {
	
	var newUser = new User({
		fname 	: req.body.fname,
		lname  	: req.body.lname,
		phone	: req.body.phone,
		email	: req.body.email,
		address : req.body.address
	});

	User.createNewUser(newUser,function (err,user) {
		if(err) throw err;

		res.send(user);
	});
});

router.post('/getAllUsers', function (req, res) {
	
	User.getAllUsers(function(err,users){
 		if(err) throw err;
		 
 		res.send(users);
 	});
});

router.post('/borrowBook', function (req, res) {

	var newBorrow = new Borrow({
		book 	: req.body.book,
		user  	: req.body.user
	});

	Borrow.newBorrow(newBorrow,function (err,borrow) {
		if(err) throw err;

		res.send(borrow);
	});
});

router.post('/getAllBorrows', function (req, res) {
	
	Borrow.getAllBorrows(function(err,borrows){
 		if(err) throw err;
		 
 		res.send(borrows);
 	});
});



module.exports = router;



