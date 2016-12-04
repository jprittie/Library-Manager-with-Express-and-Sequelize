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

// GET overdue books
router.get('/overdue', function(req, res, next) {
  Loan.findAll({
    include: [{ model: Book }],
    where: { return_by: { $lt: new Date() }, returned_on: null }
  }).then(function(booklistings){
    res.render('partials/overduebooks', {
      title: 'Overdue Books',
      loans: booklistings
    });
  });
});

// GET checked-out books
router.get('/checked_out', function(req, res, next) {
  Loan.findAll({
    include: [{ model: Book }],
    where: { returned_on: null }
  }).then(function(booklistings){
    res.render('partials/overduebooks', {
      title: 'Checked-Out Books',
      loans: booklistings
    });
  });
});

// GET book detail
router.get('/:id', function(req, res, next) {
  Book.findAll({
    include: [{ all: true }],
    where: { id: req.params.id }
  }).then(function(booklisting){
    var loanObject = JSON.parse(JSON.stringify(booklisting));
    var loanArray = [];
    for (var i=0; i<loanObject.length; i++){
      loanArray.push(loanObject[i].loan);
    }


    res.render('partials/bookdetail', {
      title: 'Book Details',
      book: booklisting,
      loans: loanArray
    });
  });
});

module.exports = router;
