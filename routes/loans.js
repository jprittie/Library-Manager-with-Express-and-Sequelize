var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;


/* GET loans page. */
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

module.exports = router;
