/* -----------------------------------------------------
   Settings, User Profiles
   ----------------------------------------------------- */

// --- Module Dependencies --- //
var 
  mongoose = require('mongoose');

// --- Models --- //
var
  User          = mongoose.model('User'),
  Language      = mongoose.model('Language'),

  Item          = mongoose.model('Item'),

  WorkoutPlan   = mongoose.model('WorkoutPlan'),
  Exercise      = mongoose.model('Exercise'),
  Step          = mongoose.model('Step'),

  DietPlan      = mongoose.model('DietPlan'),
  Day           = mongoose.model('Day'),
  Meal          = mongoose.model('Meal'),
  Recipe        = mongoose.model('Recipe'),
  CookingStep   = mongoose.model('CookingStep'),
  Ingredient    = mongoose.model('Ingredient'),

  Video         = mongoose.model('Video'),
  Book          = mongoose.model('Book'),
  Podcast       = mongoose.model('Podcast'),

  Bootcamp      = mongoose.model('Bootcamp'),
  Challenge     = mongoose.model('Challenge'),

  Transaction   = mongoose.model('Transaction'),
  Customer      = mongoose.model('Customer');

// --- Exported Methods --- //


// ----------------------------- ITEMS --------------------------------- //
exports.getItems = function(req, res, next) {
   Item.find({}, function(err, items){
    if(err){ return next(err); }
      res.json(items);
  }).populate('exercise');
};

exports.getExercises = function(req, res, next) {
  console.log(req.params._id);
  var _id = req.params._id;
  Exercise.findById(_id, function (err, exercise) {
    console.log(exercise);
    res.json(exercise);
  });
};

/* ----------------- ITEM is a purchasable item in the system
 Properties
 ----
 name: String
 upvotes: Number
 creator: { _id, username} from req.payload
 price: Number (dollar amount x 100 = cents)
 type: various subtypes | workoutplan, dietplan, video, book, podcast

 Refs
 ----
 in the creator 
 &
 <subtype> : subtype._id

 To create new item, must
    1) saveItem: Item.save
    2) saveSubItem: SubType.save with item._id reference included
    3) updateItem: update Item with refence to SubType
    4) updateUser: update User with item._id
 */

function saveItem (req, callback) {
} 

exports.postItem = function(req, res, next) {
  var item = new Item(req.body);
  item.creator = req.payload;
  console.log('============== POSTING NEW ITEM ====>\n', item);

  item.save(function (err, item) {
    if (err) { return next(err); }
    return item;
  }).then(function(err, item) {
    console.log('------> item after saving', item);
    User.findByIdAndUpdate(req.payload._id, 
      { $push: { items: item._id }}, 
      function (err, user) {
        if (err) { return next(err); }
        return item;
    });
  }).then(function () {
    console.log('------> item after saving to user', item);
    if (req.body.type === 'Video'){
      var video = new Video(req.body);
      video.item = item._id;
      video.save(function (err, video) {
        if(err){ return next(err); }
        Item.findByIdAndUpdate(item._id, { $set: { video: video._id, user: req.payload._id }}, function (err, item) {
          if (err) { return next(err); }
          return item;
        });
      });
    }
    if (req.body.type === 'Book'){
      var book = new Book(req.body);
      book.item = [item._id]
      book.save(function(err, book){
        if(err){ return next(err); }
        Item.findByIdAndUpdate(item._id, { $set: { book: book._id }}, function (err, item) {
          if (err) { return next(err); }
          return item;
        });
      });
    }
    if (req.body.type === 'Podcast'){
      var podcast = new Podcast(req.body);
      podcast.item = [item._id]
      podcast.save(function(err, podcast){
        if(err){ return next(err); }
        Item.findByIdAndUpdate(item._id, { $set: { podcast: podcast._id }}, function (err, item) {
          if (err) { return next(err); }
          return item;
          //random comment
        });
      });
    }
    if (req.body.type === 'DietPlan'){
      var dietPlan = new DietPlan(req.body);
      dietPlan.item = item._id;
      dietPlan.save(function(err, dietPlan){
        console.log('------------- diet plan ' + dietPlan._id, dietPlan);
        console.log('------------- item _id' + item._id + ' will receive dietplan: dietPlan._id');
        if(err){ return next(err); }
        Item.findByIdAndUpdate(item._id, { $set: { dietplan: dietPlan._id }}, function (err, item) {
          if (err) { return next(err); }
          return item;
        });
      });
    }
    if (req.body.type === 'Bootcamp'){
      var bootcamp = new Bootcamp(req.body);
      bootcamp.item = [item._id];
      bootcamp.save(function(err, bootcamp){
        if(err){ return next(err); }
        Item.findByIdAndUpdate(item._id, { $set: { bootcamp: [bootcamp._id] }}, function (err, item) {
          if (err) { return next(err); }
          return item;
          //random comment
        });
      });
    }
    if (req.body.type === 'WorkoutPlan'){
      var workoutPlan = new WorkoutPlan(req.body);
      workoutPlan.item = item._id;
      workoutPlan.save(function(err, workoutPlan){
        if(err){ return next(err); }
        Item.findByIdAndUpdate(item._id, { $set: { workoutplan: [workoutPlan._id] }}, function (err, item) {
          if (err) { return next(err); }
          return item;
          //random comment
        });
      });
    }
  }) 
  .then(function(item) {
    return res.json(item);
  });

};

exports.createExercise = function (req, res, next) {
 var exercise = new Exercise(req.body);
 item_id = req.params.item;
 exercise.save(function(err, exercise) {
    if (err) { return next(err); }
    Item.findByIdAndUpdate(item_id, { $push: { exercises: exercise._id } }).exec(function(err, item) {
      if(err){ return next(err); }
      res.json(item);
    });
  });
};

exports.newStep = function (req, res, next) {
 var step = new Step(req.body);
 exercise_id = req.body.exercise;
 step.save(function(err, step) {
    if (err) { return next(err); }
    Exercise.findByIdAndUpdate(exercise_id, { $push: { steps: step._id } }).exec(function(err, exercise) {
      if(err){ return next(err); }
      res.json(exercise);
    });
  });
};

exports.updateDietPlan = function(req, res, next) {
  var dietPlan = new DietPlan(req.body);
  console.log('----> updating', dietPlan);

  dietPlan.save(function(err, dietPlan) {
    if (err) { return next(err); }
    return res.json({'message': 'Successfully saved changes to diet plan.'});
  });
};

exports.getItemByIdParam = function(req, res, next, id) {
  var query = Item.findById(id);

  query.exec(function (err, item){
    if (err) { next(err); }
    if (!item) { next(new Error('can\'t find item')); }

    req.item = item;
    next();
  });
};

exports.getItemById = function (req, res, next) {
 // if(err){ next(err); }
 var _id = req.params.item;
 Item.findById(_id, function(err, item, exercises) {
    // if (err) { return next(err); }
    console.log(item);
    res.json(item);
 }).populate('exercises');
};

exports.getDietPlanById = function(req, res, next) {
  console.log(req.params);
  DietPlan.findById(req.params.dietplanid, function(err, dietPlan) {
    console.log('------>DIETPLAN', dietPlan);
    if (err) { return next(err); }
    return res.json(dietPlan);
  });
};

exports.getExercise = function (req, res, next) {
 // if(err){ next(err); }
 var _id = req.params.exercise;
 Exercise.findById(_id, function(err, exercise, steps) {
  console.log(exercise);
  res.json(exercise);
 }).populate('steps');
};

exports.getStep = function (req, res, next) {
 var _id = req.params.step;
 Step.findById(_id, function(err, step) {
  console.log(step);
  res.json(step);
 });
};

// also seems incomplete, to be implemented
exports.upvoteItem = function(req, res, next) {
  req.item.upvote(function(err, item){
    if (err) { return next(err); }

    res.json(item);
  });
};




// ----------------------------- TRANSACTIONS ------------------------------- //

// Item page & transaction
exports.createTransaction = function(req, res, next) {
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
