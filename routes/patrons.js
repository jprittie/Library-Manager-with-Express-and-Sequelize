var express = require('express');
var router = express.Router();
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
