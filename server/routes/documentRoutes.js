var _ = require('lodash');

var CodeDocument = require ('../models/document.js');
var User = require ('../models/user.js');
var findUserId = require('../middleware/findUserId');
var File = require('../models/file');
var Comment = require('../models/comment');

var checkForBadges = require('../utils/check-badges.js');
var giveTagPoints = require('../utils/tag-points.js');

var jwt = require('express-jwt');
var jwtCheck = jwt({
  secret: process.env.AUTH0SECRET || require('../../config').auth0secret,
  audience: process.env.AUTH0AUDIENCE || require('../../config').auth0audience
});

var documentRoutes = function(app){

// GET ALL DOCUMENTS
// add pagination - display most recent only
  app.get('/api/documents', function(req,res){

    //pagination options
    var options = {
      sort:     { commentedAt: -1 },
      limit:    10,
      page: req.query.page || 1,
      populate: {path:'_author',select:'username'} // change back to user_name eventually
    };

    //get documents function
    var getResponse = function(query){
      CodeDocument.paginate(query, options).then(function(result) {
        if(!result){return res.status(404).send('list of documents not found')}
        res.json(result.docs);
      });
    }

    // by tag
    if(req.query.tag){
      getResponse({tags:req.query.tag})
    }
    // by search
    else if(req.query.search){
      var queryParam= {"$regex":req.query.search, "$options": "i" }
      getResponse({$or:[{title:queryParam}, {description: queryParam},{tags: queryParam}]})
    }
    // by author
    else if(req.query.author){
      User.findOne({username:req.query.author})
        .then((user)=>{
          getResponse({_author:user._id})
        })
    }
    else {
      getResponse({})
    }

  });

// GET A DOCUMENT
  app.get('/api/documents/:id', function(req,res){
    CodeDocument.findOne({_id:req.params.id})
      .populate('_author')
      .populate('comments')
      .populate({path:'comments', populate: {path:'_author',select:'username'}}) // change back to username
      .populate({path:'comments', populate: {path:'thanks.from',select:'username'}}) // change back to username
     // .populate('files')
     // .populate({path:'files', populate: {path:'comments'}})
     // .populate({path:'files',populate:{path:'comments._author',select:'user_name'}})
      .then(function(doc){
        if(!doc){return res.status(404).send('document not found')}
        File.find({_parent:doc._id})
          .populate('comments')
          .populate({path:'comments',populate:{path:'_author'}})
          .then(function(files){
            let newdoc = doc.toObject()
              newdoc.files=files;
            res.json(newdoc)
          })
      })
  });

// CREATE A DOCUMENT
  app.post('/api/documents', jwtCheck, findUserId, function(req,res){
    //create a document
    console.log(req.user)
    var newDoc = new CodeDocument(req.body);
    newDoc._author = req.user._id;
    newDoc.commentedAt = Date.now();
    newDoc.save().then(function(doc){
      if(!doc){
        console.log('document not saved')
        return res.status(400).send('document not saved')
      }
      // add document id to the author's document list
      User.findByIdAndUpdate(
        doc._author,
        {$push: {'code_docs': doc._id}},
        {safe: true, new: true}
      )
        // check for points
        .then(function(author){
        giveTagPoints(doc, author,true);
        checkForBadges(author);
        if(!author){return res.status(404).send('author not found')}
      });
      res.send(doc);
    }).catch(function(err){
      res.status(400);
    })
  });

// UPDATE A CODE DOCUMENT

// note: to edit or delete a document, pass in :doc_id instead of :id (to correctly identify it
// with the authenticate-author middleware)
// note: be sure to add editedAt: Date.now()

  // DELETE A CODE DOCUMENT
  app.delete('/api/documents/:doc_id',function(req,res){
    CodeDocument.findByIdAndRemove(req.params.doc_id,{safe:true})
      .then((document)=>{
        // remove from author's document list
        User.findByIdAndUpdate(document._author,{$pull:{code_docs:req.params.doc_id}},{safe:true, new:true})
          .then((user)=>{console.log(user)})
        // delete comments
        document.comments.forEach((comment)=>{
          Comment.findByIdAndRemove(comment.toString(),{safe:true})
            .then((comment)=>{console.log(comment)})
        })
      })
    res.send('document deleted')
  })



};

module.exports = documentRoutes;