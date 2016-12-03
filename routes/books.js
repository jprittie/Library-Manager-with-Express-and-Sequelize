var express = require('express');
var router = express.Router();
var Book = require("../models").Book;

/* GET books page. */
router.get('/', function(req, res, next) {
  Book.findAll().then(function(booklistings){
    res.render('partials/books', {
      title: 'Books', 
      books: booklistings
    });
  });
});

module.exports = router;
