var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;


/* GET patrons page. */
router.get('/', function(req, res, next) {
  Patron.findAll().then(function(patronlistings){
    res.render('partials/patrons', {
      title: 'Patrons',
      patrons: patronlistings
    });
  });
});


module.exports = router;
