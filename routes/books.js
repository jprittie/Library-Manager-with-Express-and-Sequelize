var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;

// GET books page
router.get('/', function(req, res, next) {
  Book.findAll({order: 'title'}).then(function(booklistings){
    if(booklistings){
      res.render('partials/books', {
        title: 'Books',
        books: booklistings
      });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});

// GET overdue books
router.get('/overdue', function(req, res, next) {
  Loan.findAll({
    include: [{ model: Book }],
    where: { return_by: { $lt: new Date() }, returned_on: null },
    order: 'title'
  }).then(function(booklistings){
    if(booklistings){
      res.render('partials/overduebooks', {
        title: 'Overdue Books',
        loans: booklistings
      });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});

// GET checked-out books
router.get('/checked_out', function(req, res, next) {
  Loan.findAll({
    include: [{ model: Book }],
    where: { returned_on: null },
    order: 'title'
  }).then(function(booklistings){
    if(booklistings){
      res.render('partials/checkedoutbooks', {
        title: 'Checked-Out Books',
        loans: booklistings
      });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});


// GET new book form
router.get('/new', function(req, res, next) {
  res.render('partials/newbook', {
    title: 'Create New Book'
  });
});

// POST new book
router.post('/new', function(req, res, next) {
  Book.create(req.body)
  .then(function(book){
    res.redirect('/books/');
  }).catch(function(err){
    if (err.name === 'SequelizeValidationError') {
      console.log("Validation error");
    } else {
      res.sendStatus(500);
    }
  });
});



// GET book details
router.get('/:id', function(req, res, next) {
  Book.findAll({
    include: [{ model: Loan, include: [{ model: Patron }] }],
    where: { id: req.params.id }
  })
  .then(function(bookdetails){

    var loansdata = JSON.parse(JSON.stringify(bookdetails));
    // var bookObject = {};

    // bookObject = {
    //   id: loansdata[0].id,
    //   title: loansdata[0].title,
    //   author: loansdata[0].author,
    //   genre: loansdata[0].genre,
    //   first_published: loansdata[0].first_published
    // };

    if (bookdetails) {
      res.render('partials/bookdetail', {
        title: 'Book Details',
        book: loansdata[0],
        // book: bookObject,
        loans: loansdata[0].Loans
      });
    } else {
      res.sendStatus(404);
    }

  }).catch(function(err){
     res.send(500);
  });
});


// PUT or update book details form
router.put('/:id', function(req, res, next) {
  Book.findById(req.params.id).then(function(book){
    return book.update(req.body);
  }).then(function(book){
    res.redirect('/books/' + book.id);
  }).catch(function(err){
    res.send(500);
  });
});

module.exports = router;
