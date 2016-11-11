// am I the author of a comment or post?
// should be used AFTER authenticate (needs req.user)
var CodeDocument = require('../models/document');

var authenticateAuthor = function(req,res,next) {
    // comments
    if(req.params.comment_id){
      CodeDocument.findOne({_id: req.params.doc_id}).then(function(doc){
        
        var thisComment;
        for (var x=0; x<doc.comments.length; x++ ){
          if(doc.comments[x]._id.equals(req.params.comment_id)){
            thisComment = doc.comments[x];
          }
        }
        if(!thisComment){
          res.status(404).send('comment not found');
        }
        if(req.user._id.equals(thisComment.author)){
          next();
        } else {
          res.status(401).send('not authorized to modify this comment: you are not the author')
        }
      })
    }
      // code documents
    else {
      CodeDocument.findOne({_id: req.params.doc_id}).then(function(doc){
        if(req.user._id.equals(doc.author)){
          next();
        } else {
          res.status(401).send('not authorized to modify this document: you are not the author')
        }
      })
    }
}

module.exports = authenticateAuthor;

