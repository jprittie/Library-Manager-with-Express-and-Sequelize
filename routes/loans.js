'use strict';

var express = require('express');
var router = express.Router();
var moment = require('moment');
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;


// GET loans page
router.get('/', function(req, res, next) {
  Loan.findAll({
    include: [{ all: true }],
    order: 'Book.title'
  }).then(function(loanlistings){

    if (loanlistings) {
      res.render('partials/loans', {
        title: 'Loans',
        loans: loanlistings
      });
    } else {
      err.status == 404;
      return next(err);
    }

  }).catch(function(err){
    return next(err);
  });
}); // ends get



// GET overdue loans
router.get('/overdue', function(req, res, next) {
  Loan.findAll({
    include: [{ all: true }],
		where: { return_by: { $lt: moment().format('YYYY-MM-DD').toString() }, returned_on: null }
  }).then(function(loanlistings){
    var loansdata = JSON.parse(JSON.stringify(loanlistings));

    if (loanlistings) {
      res.render('partials/overdueloans', {
        title: 'Overdue Loans',
        loans: loansdata
      });
    } else {
      err.status == 404;
      return next(err);
    }

  }).catch(function(err) {
    return next(err);
  });
}); // ends get

// GET checked-out loans
router.get('/checked_out', function(req, res, next) {
  Loan.findAll({
    include: [{ all: true }],
  	where: { returned_on: null }
  }).then(function(loanlistings){
    if (loanlistings) {
      res.render('partials/checkedoutloans', {
        title: 'Checked-Out Loans',
        loans: loanlistings
      });
    } else {
      err.status == 404;
      return next(err);
    }
  }).catch(function(err) {
    return next(err);
  });
});



// Get return book form and details via loan id
router.get('/return/:id', function(req, res, next) {
  Loan.findById((req.params.id), {
    include: [{ all: true }],
  })
  .then(function(loandetails){
    if (loandetails) {
      loandetails.returned_on = moment().format('YYYY-MM-DD');
      res.render('partials/returnbook', {
        title: 'Return Book',
        loan: loandetails
      });
    } else {
      err.status == 404;
      return next(err);
    }
  }).catch(function(err){
    return next(err);
  });
});


// PUT or update return book using loan id
router.put('/return/:id', function(req, res, next) {
  Loan.findById(req.params.id).then(function(loan){
    return loan.update(req.body);
  }).then(function(loan){
    res.redirect('/loans/');
  }).catch(function(err){
    // if validation error, re-render page with error messages
    if (err.name == 'SequelizeValidationError') {

      Loan.findById((req.params.id), {
        include: [{ all: true }],
      })
      .then(function(loandetails){
        // loop over err messages
        var errMessages = [];
        for (var i=0; i<err.errors.length; i++) {
          errMessages[i] = err.errors[i].message;
        }
        loandetails.returned_on = moment().format('YYYY-MM-DD');
        res.render('partials/returnbook', {
          title: 'Return Book',
          loan: loandetails,
          errors: errMessages
        });
      });
    } else {
      // if it's not a validation error, send to middleware error handler
      return next(err);
    }

  }); // ends catch
});


// GET new loan form
router.get('/new', function(req, res, next) {
  var bookdetails;
  var patrondetails;

  Book.findAll({
    attributes: ['id', 'title'],
    order: 'title',
    // include: [{ model: Loan }]
  }).then(function(results){
    console.log(results);
    // don't let same book be borrowed more than once
    bookdetails = results;
  }).then(
    Patron.findAll({
      attributes: ['id', 'first_name', 'last_name'],
      order: 'last_name'
    }).then(function(results){
      patrondetails = results;
    }).then(function(){
      res.render('partials/newloan', {
        title: 'Create New Loan',
        books: bookdetails,
        patrons: patrondetails,
        loaned_on: moment().format('YYYY-MM-DD'),
        return_by: moment().add(7, 'days').format('YYYY-MM-DD')
      });
    }).catch(function(err){
      return next(err);
    })
  );
});

// POST new loan form
router.post('/new', function(req, res, next) {
  Loan.create(req.body)
  .then(function(loan){
    res.redirect('/loans/');
  }).catch(function(err){
    // if validation error, re-render page with error messages
    if (err.name == 'SequelizeValidationError') {

      // loop over err messages
      var errMessages = [];
      for (var i=0; i<err.errors.length; i++) {
        errMessages[i] = err.errors[i].message;
      }

      var bookdetails;
      var patrondetails;

      Book.findAll({attributes: ['id', 'title'], order: 'title'}).then(function(results){
        bookdetails = results;
      }).then(
        Patron.findAll({
          attributes: ['id', 'first_name', 'last_name'],
          order: 'last_name'
        }).then(function(results){
        patrondetails = results;
        }).then(function(){
          res.render('partials/newloan', {
            title: 'Create New Loan',
            books: bookdetails,
            patrons: patrondetails,
            loaned_on: moment().format('YYYY-MM-DD'),
            return_by: moment().add(7, 'days').format('YYYY-MM-DD'),
            errors: errMessages
          });
        }); // ends then
      ); // ends then
    } else {
      // if it's not a validation error, send to middleware error handler
      return next(err);
    }
  }); // ends catch
}); // ends POST

module.exports = router;
