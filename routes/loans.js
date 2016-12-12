var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;


/* GET loans page */
router.get('/', function(req, res, next) {
  Loan.findAll({
    include: [{ all: true }]
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
		where: { return_by: { $lt: new Date() }, returned_on: null }
  }).then(function(loanlistings){
    console.log(loanlistings);

    res.render('partials/overdueloans', {
      title: 'Loans',
      loans: loanlistings
    });
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
      title: 'Loans',
      loans: loanlistings
    });
  });
});



// Get return book form
router.get('/return/:id', function(req, res, next) {
  Loan.findById({
    include: [{ all: true }],
  })
  .then(function(loandetails){
    res.render('partials/returnbook', {
      title: 'Return Book',
      loan: loandetails,
      returndate: new Date()
    });
  }).catch(function(err){
    res.sendStatus(500);
  });
});


// PUT or update return book
router.put('/return/:id', function(req, res, next) {
  Loan.findById(req.params.id).then(function(loan){
    return loan.update(req.body);
  }).then(function(book){
    res.redirect('/loans/');
  }).catch(function(err){
    res.sendStatus(500);
  });
});


module.exports = router;
