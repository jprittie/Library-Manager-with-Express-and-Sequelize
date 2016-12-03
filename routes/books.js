var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;

/* GET books page. */
router.get('/', function(req, res, next) {
  Book.findAll().then(function(booklistings){
    res.render('partials/books', {
      title: 'Books',
      books: booklistings
    });
  });
});

//Overdue books aren't populating
router.get('/overdue', function(req, res, next) {
  Loan.findAll({
    include: [{ model: Book}],
    where: { return_by: { $lt: new Date() }, returned_on: null }
  }).then(function(booklistings){
    res.render('partials/books', {
      title: 'Overdue Books',
      books: booklistings
    });
  });
});

//Checked out books aren't populating
router.get('/checked_out', function(req, res, next) {
  Loan.findAll({
    include: [{ model: Book}],
    where: { returned_on: null }
  }).then(function(booklistings){
    res.render('partials/books', {
      title: 'Overdue Books',
      books: booklistings
    });
  });
});

module.exports = router;
