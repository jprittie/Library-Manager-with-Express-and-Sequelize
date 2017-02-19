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
    if (err.name == 'SequelizeValidationError') {
      console.log("Validation error");

      // loop over err messages
      var errMessages = [];
      for (i=0; i<err.errors.length; i++) {
        errMessages[i] = err.errors[i].message;
      }

      /* I want to keep existing fields from clearing out on submit (i.e., so that if there's a validation error the librarian doesn't have to re-enter all the data), so I have added logic in the newbook template to check which properties of req.body exist. I'm making req.body available to the template via the following object */

      res.render('partials/newbook', {
        title: 'Create New Book',
        bookTitle: req.body.title,
        bookAuthor: req.body.author,
        bookGenre: req.body.genre,
        bookPublished: req.body.first_published,
        errors: errMessages
      });

    } else {
      res.sendStatus(500);
      next(err);
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

    if (bookdetails) {
      res.render('partials/bookdetail', {
        title: 'Book Details',
        book: loansdata[0],
        loans: loansdata[0].Loans
      });
    } else {
      res.sendStatus(404);
    }

  }).catch(function(err){
    res.sendStatus(500);
    next(err);
  });
});


// PUT or update book details form
router.put('/:id', function(req, res, next) {
  Book.findById(req.params.id).then(function(book){
    return book.update(req.body);
  }).then(function(book){
    res.redirect('/books/' + book.id);
  }).catch(function(err){

    if (err.name === 'SequelizeValidationError') {
      console.log("Validation error");

      Book.findAll({
        include: [{ model: Loan, include: [{ model: Patron }] }],
        where: { id: req.params.id }
      })
      .then(function(bookdetails){

        var loansdata = JSON.parse(JSON.stringify(bookdetails));
        // loop over err messages
        var errMessages = [];
        for (i=0; i<err.errors.length; i++) {
          errMessages[i] = err.errors[i].message;
        }

        if (bookdetails) {
          res.render('partials/bookdetail', {
            title: 'Book Details',
            book: loansdata[0],
            loans: loansdata[0].Loans,
            errors: errMessages
          });
        } else {
          res.sendStatus(404);
        }

      }).catch(function(err){
        res.sendStatus(500);
        next(err);
      });
    }
  });
});

module.exports = router;
