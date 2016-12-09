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
    console.log(patrondetails);
    console.log("patrondetails[0].Loans[0] is " + patrondetails[0].Loans[0]);
    console.log("patrondetails[0].Loans[0].return_by is " + patrondetails[0].Loans[0].return_by);
    var loanArray = [];
    loanArray.push(patrondetails[0].Loans);

    console.log("loanArray[0] is " + loanArray[0]);
    console.log("loanArray[0].Loans is " + loanArray[0].Loans);

    for (var i=0; i<loanArray.length; i++) {
      console.log("loanArray[i] is " + loanArray[i]);
    }

    if (patrondetails) {
      res.render('partials/patrondetail', {
        title: 'Patron Details',
        patron: patrondetails[0],
        loans: loanArray
      })
    } else {
      res.sendStatus(404);
    }
  }).catch(function(err){
     res.send(500);
  });
});

module.exports = router;
