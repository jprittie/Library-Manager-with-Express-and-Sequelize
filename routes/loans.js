var express = require('express');
var router = express.Router();
var Loan = require("../models").Loan;

/* GET loans page. */
router.get('/', function(req, res, next) {
  Loan.findAll().then(function(loanlistings){
    res.render('partials/loans', {
      title: 'Loans',
      loans: loanlistings
    });
  });
});

module.exports = router;
