// am I the author of a comment or post?
// should be used AFTER authenticate (needs req.user)
var CodeDocument = require('../models/document');
var Comment = require('../models/comment');

var authenticateAuthor = function(req,res,next) {
    // comments
    if(req.params.comment_id){
      Comment.findOne({_id: req.params.comment_id}).then(function(comment){
        if(req.user._id.equals(comment._author)){
          next();
        } else {
          res.status(401).send('not authorized to modify this comment: you are not the author');
        }
      });
    }
      // code documents
    else {
      CodeDocument.findOne({_id: req.params.doc_id}).then(function(doc){
        if(req.user._id.equals(doc._author)){
          next();
        } else {
          res.status(401).send('not authorized to modify this document: you are not the author');
        }
      });
    }
}

module.exports = authenticateAuthor;

