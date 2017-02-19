'use strict';

var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
var Loan = require("../models").Loan;
var Patron = require("../models").Patron;


// GET patrons page
router.get('/', function(req, res, next) {
  Patron.findAll({order: 'last_name'}).then(function(patronlistings){
    if (patronlistings) {
      res.render('partials/patrons', {
        title: 'Patrons',
        patrons: patronlistings
      });
     } else {
        err.status == 404;
        return next(err);
      }
  }).catch(function(err){
    return next(err);
  });
});

// GET new patron form
router.get('/new', function(req, res, next) {
  res.render('partials/newpatron', {
    title: 'Create New Patron'
  });
  if (err) return next(err);
});

// POST new patron
router.post('/new', function(req, res, next) {
  Patron.create(req.body)
  .then(function(patron){
    res.redirect('/patrons/');
  }).catch(function(err){
    // if there's a validation error, re-render page with errors
    if (err.name == 'SequelizeValidationError') {

      // loop over err messages
      var errMessages = [];
      for (var i=0; i<err.errors.length; i++) {
        errMessages[i] = err.errors[i].message;
      }

      /* I want to keep existing fields from clearing out on submit (i.e., so that if there's a validation error the librarian doesn't have to re-enter all the data), so I have added logic in the newpatron template to check which properties of req.body exist. I'm making req.body available to the template via the following object */
      res.render('partials/newpatron', {
        title: 'Create New Patron',
        patronFirstName: req.body.first_name,
        patronLastName: req.body.last_name,
        patronAddress: req.body.address,
        patronEmail: req.body.email,
        patronLibraryId: req.body.library_id,
        patronZipCode: req.body.zip_code,
        errors: errMessages
      });
    } else {
      // else send to middleware error handler
      return next(err);
    }
  }); // ends catch
}); // ends POST

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
      });
    } else {
      err.status == 404;
      return next(err);
    }
  }).catch(function(err){
    return next(err);
  });
});


// PUT or update patron details form
router.put('/:id', function(req, res, next) {
  Patron.findById(req.params.id).then(function(patron){
    return patron.update(req.body);
  }).then(function(patron){
    res.redirect('/patrons/' + patron.id);
  }).catch(function(err){
    // if there's a validation error, re-render page with errors
    if (err.name == 'SequelizeValidationError') {

      Patron.findAll({
        include: [{ model: Loan, include: [{ model: Book }] }],
        where: { id: req.params.id }
      })
      .then(function(patronlistings){
        var patrondetails = JSON.parse(JSON.stringify(patronlistings));
        // loop over err messages
        var errMessages = [];
        for (var i=0; i<err.errors.length; i++) {
          errMessages[i] = err.errors[i].message;
        }

        if (patrondetails) {
          res.render('partials/patrondetail', {
            title: 'Patron Details',
            patron: patrondetails[0],
            loans: patrondetails[0].Loans,
            errors: errMessages
          });
        } // ends if

      }); // ends then
    } else {
      // else send to middleware error handler
      return next(err);
    }
  }); // ends catch
});


module.exports = router;
