var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;


// GET patrons page
router.get('/', function(req, res, next) {
  Patron.findAll().then(function(patronlistings){
    res.render('partials/patrons', {
      title: 'Patrons',
      patrons: patronlistings
    });
  });
});


// GET patron details
router.get('/:id', function(req, res, next) {
  Patron.findAll({
    include: [{ model: Loan, include: [{ model: Book }] }],
    where: { id: req.params.id }
  })
  .then(function(patronlistings){
    var patrondetails = JSON.parse(JSON.stringify(patronlistings));

    if (patrondetails) {
      res.render('partials/patrondetail', {
        title: 'Patron Details',
        patron: patrondetails[0],
        loans: patrondetails[0].Loans
      })
    } else {
      res.sendStatus(404);
    }
  }).catch(function(err){
     res.sendStatus(500);
  });
});


// PUT or update patron details form
router.put('/:id', function(req, res, next) {
  Patron.findById(req.params.id).then(function(patron){
    return patron.update(req.body);
  }).then(function(patron){
    res.redirect('/patrons/' + patron.id);
  }).catch(function(err){
    res.sendStatus(500);
  });
});

module.exports = router;
