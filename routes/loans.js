var express = require('express');
var router = express.Router();
var moment = require('moment');
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;


/* GET loans page */
router.get('/', function(req, res, next) {
  Loan.findAll({
    include: [{ all: true }],
    order: 'Book.title'
  }).then(function(loanlistings){
    var loansdata = JSON.parse(JSON.stringify(loanlistings));
    console.log(loansdata);
    res.render('partials/loans', {
      title: 'Loans',
      loans: loanlistings
    });
  });
});

/* GET overdue loans */
router.get('/overdue', function(req, res, next) {
  Loan.findAll({
    include: [{ all: true }],
		where: { return_by: { $lt: moment().format('YYYY-MM-DD').toString() }, returned_on: null }
  }).then(function(loanlistings){
    var loansdata = JSON.parse(JSON.stringify(loanlistings));
    console.log(loansdata);
      res.render('partials/overdueloans', {
        title: 'Overdue Loans',
        loans: loansdata
      });
  }).catch(function(error) {
    res.sendStatus(500);
  });
});

/* GET checked-out loans */
// But what's the difference between all loans and checked-out loans?
router.get('/checked_out', function(req, res, next) {
  Loan.findAll({
    include: [{ all: true }],
  	where: { returned_on: null }
  }).then(function(loanlistings){
    res.render('partials/checkedoutloans', {
      title: 'Checked-Out Loans',
      loans: loanlistings
    });
  }).catch(function(error) {
    res.sendStatus(500);
  });
});



// Get return book form and details via loan id
router.get('/return/:id', function(req, res, next) {
  Loan.findById((req.params.id), {
    include: [{ all: true }],
  })
  .then(function(loandetails){
    loandetails.returned_on = moment().format('YYYY-MM-DD');
    res.render('partials/returnbook', {
      title: 'Return Book',
      loan: loandetails
    });
  }).catch(function(err){
    res.sendStatus(500);
  });
});


// PUT or update return book using loan id
router.put('/return/:id', function(req, res, next) {
  Loan.findById(req.params.id).then(function(loan){
    return loan.update(req.body);
  }).then(function(loan){
    res.redirect('/loans/');
  }).catch(function(err){
    res.sendStatus(500);
  });
});


// GET new loan form
router.get('/new', function(req, res, next) {
  var bookdetails;
  var patrondetails;

  Book.findAll({attributes: ['id', 'title'], order: 'title'}).then(function(results){
    bookdetails = results;
  }).then(
    Patron.findAll({
      attributes: ['id', 'first_name', 'last_name'],
      order: 'last_name'
    }).then(function(results){
    console.log("results is " + results);
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
      console.log(err);
      res.sendStatus(500);
    })
  );
});

// PUT new loan form
router.post('/new', function(req, res, next) {
  Loan.create(req.body)
  .then(function(loan){
    res.redirect('/loans/');
  }).catch(function(err){
    res.sendStatus(500);
  });
});

module.exports = router;
