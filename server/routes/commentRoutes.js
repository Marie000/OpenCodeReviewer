var _ = require('lodash');
var stormpath = require('express-stormpath');

// models
var User = require ('../models/user.js');
var CodeDocument = require ('../models/document.js');
var Comment = require('../models/comment.js');
var File = require('../models/file.js');

// middleware
var authenticateAuthor = require('../middleware/authenticate-author.js');
var findUserId = require('../middleware/findUserId');

var checkForBadges = require('../utils/check-badges.js');
var giveTagPoints = require('../utils/tag-points.js');



var commentRoutes = function(app){

// CREATE A COMMENT
  app.post('/api/comments/', stormpath.authenticationRequired, findUserId, function(req,res){
    // add comment
    var body = req.body;
    body._author = req.user._id;
    var newComment = new Comment(req.body);
    newComment.save().then(function(comment){
      // add comment id to the author's comment list
      User.findByIdAndUpdate(
        comment._author,
        {$push: {'comments': comment._id}},
        {safe: true, new: true}
      ).then(function(author){
        if(!author){return res.status(404).send('author not found')}
      });

      /* Disabled while I work on the file-specific comments
      // add document id to the author's point.comments array
      // (list of documents commented on)
      User.findOne({_id:comment._author}).then(function(user){
        // first, make sure the document is not already listed:
        if(user.points.reviews.indexOf(comment._document_id)===-1){
          //Make sure you are not the author of the original document
          CodeDocument.findOne({_id:comment._document_id}).then(function(doc){
            if(!doc){return res.status(404).send('no document found for this comment')}
            if(!user._id.equals(doc._author)){
              var updatedUser = user;
              updatedUser.points.reviews.push(comment._document_id);
              User.update({_id:user._id},{ $set: { points: updatedUser.points }}, function(){
                
              })
              giveTagPoints(doc, user, false);
              checkForBadges(updatedUser);
            }
          })

        }
      })
      */
      // add comment's id to the code document's comment list
      if(comment._document_id) {
        CodeDocument.findByIdAndUpdate(
          comment._document_id,
          {$push: {'comments': comment._id}, $set: {'commentedAt': Date.now()}},
          {safe: true, new: true}
        ).then(function (document) {
          if (!document) {
            return res.status(404).send('document not found')
            console.log('document not found')
          }
          else {
            res.send('comment added to document')
          }
        })
      }

      if(comment._file_id){
        File.findByIdAndUpdate(
          comment._file_id,
          {$push: {'comments': comment._id}},
          {safe: true, new:true}
        ).then(function(file){
          if(!file){ return res.status(404).send('file not found')
            console.log('file not found')
          }
          else {res.send('comment added to file')}
        })
      }
    }).catch(function(err){
      res.status(400);
    });
  });

// THANK SOMEONE FOR A COMMENT
  app.post('/api/comments/:id/thanks', stormpath.authenticationRequired, findUserId, function(req,res){
    // Check that the person can send that thanks
    Comment.findById(req.params.id).then(function(comment){
      // Do not thank yourself
      if(req.user._id.equals(comment._author)){
        return res.status(401).send('you cannot thank yourself');
      }
      // You already thanked for that comment
      if(comment.thanks.length>0) {
        for (var x = 0; x < comment.thanks.length; x++) {
          if (comment.thanks[x].from.equals(req.user._id)) {
            return res.status(401).send('you already thanked that comment');
          }
        }
      }
      // if user is authorized to send that thanks:
      // add thank to the comment document
      Comment.findByIdAndUpdate(
        req.params.id,
        {$push:{'thanks': {from: req.user._id, date:Date.now()}}},
        {safe: true, new: true}
      ).then(function(comment){
        if(!comment){return res.status(404).send('comment not found')}
        // add thank to the user document
        User.findByIdAndUpdate(
          comment._author,
          {$push:{'points.thanks': {for_comment:comment._id, from:req.user._id, date:Date.now()}}},
          {safe: true, new: true}
        ).then(function(user){
          if(!user){return res.status(404).send('user not found')}
          res.json(comment)
        });
      });
    });
  });


// DELETE A COMMENT
  // NOTE: keep :comment_id because it is needed for authenticateAuthor middleware
  app.delete('/api/comments/:comment_id', stormpath.authenticationRequired, findUserId, authenticateAuthor, function(req,res){
    res.send('trying to delete');
  });

// EDIT A COMMENT
  app.put('/api/comments/:comment_id', stormpath.authenticationRequired, findUserId, authenticateAuthor, function(req,res){
    res.send('trying to edit');
  });

};

module.exports = commentRoutes;