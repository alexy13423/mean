/* -----------------------------------------------------
   Posts and Comments
   ----------------------------------------------------- */
   
// --- Module Dependencies ---
var mongoose = require('mongoose');

// --- Models ---
var
  Post          = mongoose.model('Post'),
  Comment       = mongoose.model('Comment');

// --- Exported Methods ---
exports.getPosts = function(req, res, next) {
  Post.find({}, function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
};

exports.createPost = function(req, res, next) {
  var post = new Post(req.body);
  post.creator = req.payload;
  console.log('new post', post)

  post.save(function(err, post){
    if(err){ return next(err); }

    return res.json(post);
  });
};

exports.getPostByIdParam = function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
};

exports.getPostById = function(req, res, next) {
  var _id = req.params.post;
  Post.findById(_id)
  .populate('comments')
  .exec(function(err, post) {
    if (err) { return next(err); }
    console.log(post);
    res.json(post);
  });
};

exports.upvotePost = function(req, res, next) {
  Post.update({_id: req.params.post}, {$inc: {upvotes: 1}}, function(err, post) {
    if (err) { return next(err); }
    res.json(post);
  });
};


exports.createComment = function(req, res, next) {
  var comment = new Comment(req.body);
  var post_id = req.body.post;

  comment.save(function(err, comment) {
    if (err) { return next(err); }

    var update = { $push: { comments: comment._id }};

    Post.findByIdAndUpdate(post_id, update)
    .exec(function(err, post) {
      if(err){ return next(err); }
      res.json(comment);
    });
  });
};

exports.upvoteComment = function(req, res, next) {
  Comment.update({_id: req.params.comment}, {$inc: {upvotes: 1}}, function(err, comment) {
    if (err) return next(err);
    res.json({'message': 'comment upvoted'});
  });
};

exports.getCommentByIdParam = function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
};
