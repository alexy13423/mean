/* -----------------------------------------------------
   Transactions & Customers`
   ----------------------------------------------------- */

// --- Module Dependencies --- //
var mongoose = require('mongoose');
var extend = require('util')._extend;
var config = require('./../../env.json')[process.env.NODE_ENV || 'development'];
var stripe = require('stripe')(config['STRIPE_SECRET_KEY']);


// --- Models --- //
var
  User          = mongoose.model('User'),
  Transaction   = mongoose.model('Transaction'),
  Customer      = mongoose.model('Customer');

// ----------------------------- TRANSACTIONS ------------------------------- //

// Item page & transaction
exports.createTransaction = function(req, res, next) {
  console.log(req.payload.stripe_id);
  var source =  { object: 'card', number: req.body.number, exp_month: req.body.month, exp_year: req.body.year, cvc: req.body.cvc, name: req.body.cardholder_name };
  stripe.customers.createSource(req.payload.stripe_id,
    { source: source },
    function(err, card) {
      if(err) {return next(err); }
      User.findByIdAndUpdate(req.payload._id, { $addToSet: { stripe_card: card } }, function(err, user) {
        if(err){ return next(err); }
        console.log('Success! Saved card');
      });
      stripe.charges.create({
        amount: req.body.price,
        currency: "usd", //to be changed
        source: source
      }, function(err, charge) {
        if(err){ return  next(err); }
        if(charge.paid){
          User.findByIdAndUpdate(req.payload._id, { $addToSet: { purchases: req.body._id } }, function(err, user) {
            if(err) { return next(err); }
            console.log('Success! Saved item to user');
          });
        }
      });
      res.json(card);
    });
};

//transaction page & create customer
exports.getTransactions = function(req, res, next) {
  Transaction.find({}, function(err, transactions){
    if(err){ return next(err); }

    res.json(transactions);
  });
};

exports.getTransactionById = function(req, res, next) {
  var id = req.params.transaction;
  // to be completed
  // Transaction,findById(id, ...)
};



// ----------------------------- CUSTOMERS  --------------------------------- //

// for route: router.post('/api/transaction/:transaction/customers'
exports.createCustomerOnTransaction = function(req, res, next) {
  stripe.token.create({
    card: {
      "number": '4242424242424242',
      "exp_month": 12,
      "exp_year": 2016,
      "cvc": '123'
    }
  }, function(err, token) {
    // asynchronously called
  });
};



exports.getCustomers = function(req, res, next) {
  Customer.find({}, function(err, customers){
    if(err){ return next(err); }

    res.json(customers);
  });
};

exports.getCustomerById = function(req, res, next) {
  var id = req.params.customoer;
  // to be completed
  // Customer.findById(id, ...)
};

