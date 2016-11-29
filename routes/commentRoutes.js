var _ = require('lodash');

// models
var User = require ('../models/user.js');
var CodeDocument = require ('../models/document.js');
var Comment = require('../models/comment.js');
// middleware
var authenticate = require('../middleware/authenticate.js');
var authenticateAuthor = require('../middleware/authenticate-author.js');


var commentRoutes = function(app){


// CREATE A COMMENT
  app.post('/api/comments/', authenticate, function(req,res){
    // IMPORTANT: pass in the code document id in the request somehow.
    // add comment to code document
    // NOTE: author does not need to be passed in the body - author will be authenticated user
    var body = req.body;
    body._author = req.user._id;
    var newComment = new Comment(req.body);
    console.log('newComment',newComment)
    newComment.save().then(function(comment){
      // add comment id to the author's comment list
      console.log(comment)
      User.findByIdAndUpdate(
        comment._author,
        {$push: {'comments': comment._id}},
        {safe: true, new: true}
      ).then(function(author){
        if(!author){return res.status(404).send('author not found')}
      });

      // add document id to the author's point.comments array
      // (list of documents commented on)
      // first, make sure the document is not already listed:
      User.findOne({_id:comment._author}).then(function(user){
        // does indexOf work with objectIds? or should I loop through the array with .equals?
        if(user.points.reviews.indexOf(comment._document_id)===-1){
          var updatedUser = user;
          updatedUser.points.reviews.push(comment._document_id);
          updatedUser.save();
        }
      });

      CodeDocument.findByIdAndUpdate(
        comment._document_id,
        {$push: {'comments': comment._id}, $set: {'commentedAt':Date.now()}},
        {safe: true, new: true}
      ).then(function(document){
        if(!document){return res.status(404).send('document not found')}
        else {res.send('comment added')}
      })
    }).catch(function(err){
      res.status(400);
    });
  });

// THANK SOMEONE FOR A COMMENT
  app.post('/api/comments/:id/thanks', authenticate, function(req,res){
    // NOTE: will need to make sure people do not thank the same person for the
    // same comment more than once, and that people do not thank themselves.

    // add thank to the comment document
    Comment.findByIdAndUpdate(
      req.params.id,
      // add date to thanks object
      {$push:{'thanks': {from: req.user._id}}},
      {safe: true, new: true}
    ).then(function(comment){
      if(!comment){return res.status(404).send('comment not found')}
      // add thank to the user document
      User.findByIdAndUpdate(
        comment._author,
        // add date to thanks object
        {$push:{'points.thanks': {for_comment:comment._id, from:req.user._id}}},
        {safe: true, new: true}
      ).then(function(user){
        if(!user){return res.status(404).send('user not found')}
        res.json(comment)
      })
    })
  });


// DELETE A COMMENT
  app.delete('/api/comments/:comment_id', authenticate, authenticateAuthor, function(req,res){
    res.send('trying to delete')
  });

// EDIT A COMMENT
  app.put('/api/comments/:comment_id', authenticate, authenticateAuthor, function(req,res){
    res.send('trying to edit')
  });


};

module.exports = commentRoutes;