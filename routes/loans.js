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
    res.render('partials/loans', {
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
    res.render('partials/loans', {
      title: 'Loans',
      loans: loanlistings
    });
  });
});

module.exports = router;
