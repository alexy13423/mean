/* -----------------------------------------------------
   Events
   ----------------------------------------------------- */

// --- Module Dependencies --- //
var mongoose = require('mongoose');
var extend = require('util')._extend;
var config = require('./../../env.json')[process.env.NODE_ENV || 'development'];

// --- Models --- //
var
  User          = mongoose.model('User'),
  Event         = mongoose.model('Event'),

  Bootcamp      = mongoose.model('Bootcamp'),
  Challenge     = mongoose.model('Challenge'),
  Session       = mongoose.model('Session');

var subItemInstantiation = {
  bootcamp  : function(item) { return new Bootcamp(item); },
  challenge : function(item) { return new Challenge(item); },
  session   : function(item) { return new Session(item); }
};
var subItemModel = {
  bootcamp: Bootcamp,
  challenge: Challenge,
  session: Session 
};

// --- Exported Methods --- //

// ----------------------------- ITEMS --------------------------------- //
exports.getEvents = function(req, res, next) {
  var query = req.query.creator? {'creator._id': req.query.creator} : {};
  Event.find(query)
   .populate('bootcamp challenge session')
   .exec(function(err, events){
      console.log('--events', events);
      if(err){ return next(err); }
      var result = [];
      events.forEach(function(event) {
        result.push(removeNullSubtypeFields(event));
      });
      return res.json(result);
   });
};


/* ---------- ITEM is a purchasable item in the system
---- Properties ----
 name: String
 upvotes: Number
 creator: { _id, username} from req.payload
 price: Number (dollar amount x 100 = cents)
 type: various subtypes | workoutplan, dietplan, video, book, podcast

---- Refs ----
 in the creator   &   <subtype> : subtype._id

 To create new item, must
    1) saveItem: Item.save
    2) saveSubItem: SubType.save with item._id reference included
    3) updateItem: update Item with refence to SubType
    4) updateUser: update User with item._id
 */
exports.postEvent = function(req, res, next) {
  var item = new Item(req.body);
      item.creator = req.payload;
  var subitem = subItemInstantiation[item.type](req.body);
  var user = { _id: req.payload._id };
  _saveItem(item, function(err, item) {
    _saveSubItem(err, item, subitem, function(err, item, subitem) {
      _updateItemWithSubitemId(err, item, subitem, function(err, item, subitem) {
        User.findByIdAndUpdate(
          req.payload._id,
          { $push: { items: item._id } },
          { new: true },
          function(err, user) {
            if (err) { return next(err); }
            console.log('------>ITEM ', item.type, item._id);
            console.log('------>USER ITEMS ', user.items);
            item[item.type] = subitem._id;
            console.log('------>RESULT', item);
            return res.json(item);
          }
        );
      });
    });
  });
};
// INTERNAL HELPER FUNCTIONS for POST ITEM
function _saveItem (item, callback) {
  item.save(function (err, item) {
    if (err) { return next(err); }
    console.log('------> item after saving', item);
    callback(null, item);
  });
}
function _saveSubItem (err, item, subitem, callback) {
  subitem.item = item._id;
  subitem.save(function(err, subitem) {
    if(err){ return next(err); }
    callback(null, item, subitem);
  });
}
function _updateItemWithSubitemId (err, item, subitem, callback) {
  // this will be the update needed, matching the type of the item
  // e.g. { $set : { 'video' : video._id }} 
  var update = {};
  update[item.type] = subitem._id;
  Item.findByIdAndUpdate(
    item._id, 
    { $set : update },
    { new: true},
    function(err, item) {
      if (err) { return next(err); }
      callback(null, item, subitem);
  });
}

/*   in the front end, our items are flattened with the format
 *   { _id       : item_id,
 *     <subtype> : subitem_id, ... }
 *
 *   We will want to update the subitem with the _id swapped to 
 *   { _id       : subitem_id, 
 *     item      : item_id, ... }                               */
exports.updateEvent = function(req, res, next) {
  var type = req.body.type;
  var subitem_id = req.body[type];
  var model = subItemModel[type];

  // might need to update price/name in Item object??
  // Item.findByIdAndUpdate(
    // req.body._id,
    // req.body, 
    // function(err, item) {
      // if (err) { return next(err); }
      swapIds(req.body);
      model.findByIdAndUpdate(
        subitem_id,
        req.body,
        {new: true},
        function(err, subitem) {
          if (err) { return next(err); }
          return res.json(subitem);
      });
    // }
  // );
};

exports.getEventById = function (req, res, next) {
 var item_id = req.params.item;
 Item.findById(item_id)
 .populate('dietplan workoutplan video book podcast')
 .exec(function(err, item) {
    if (err) { return next(err); }
    console.log('----> populated\n', item);
    if (item) {
      return res.json(removeNullSubtypeFields(item));
    } else {
      return res.json({message: 'no item found'});
    }
 });
};

exports.upvoteEvent = function(req, res, next) {
  Item.update(
    {_id: req.params.item},
    {$inc: {upvotes: 1}},
    function(err, item){
      if (err) { return next(err); }
      res.json(item);
  });
};

exports.deleteEvent = function(req, res, next) {
  var item_id = req.params.item;
  Item.findByIdAndRemove(item_id, function (err, item) {
    if (err) { return next(err); }
    User.findByIdAndUpdate(item_id,
      { $pull: {items: {_id: item_id} }}, 
      function (err, items) {
        if(err){ return next(err); }
        console.log(items);
        res.json({message: 'Successfully deleted item ' + item_id, success: true});
    });    
  });
};


// ---------------  HELPER FUNCTIONS ------------------- //
function swapIds (item) {
  // this is an Item, and we want Ids in <Subitem> format
  if (!item.item) {
    var  item_id  = item._id,
      subitem_id  = item[item.type];
        item._id  = subitem_id; // make sure what we post gets diet_id as _id
        item.item = item_id;    // item gets item_id
  } else {
    var subitem_id = item._id,
           item_id = item.item;
          item._id = item_id;    // make sure what we post gets item_id as _id
   item[item.type] = subitem_id; // item.Subitem gets subitem_id
  }
}

var types = ['bootcamp', 'challenge', 'session'];
function removeNullSubtypeFields(item) {
  item = item.toObject();
  types.forEach(function(type) {
    if (item[type] === null) {
      delete item[type];
    }
  });
  return item;
}