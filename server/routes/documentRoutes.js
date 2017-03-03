var _ = require('lodash');
var stormpath = require('express-stormpath');

var CodeDocument = require ('../models/document.js');
var User = require ('../models/user.js');
var findUserId = require('../middleware/findUserId');
var File = require('../models/file');

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
    var query   = {};
    // by tag
    if(req.query.tag){
      query = {tags:req.query.tag}
    }
    // by search
    if(req.query.search){
      var queryParam= {"$regex":req.query.search, "$options": "i" }
      query = {$or:[{title:queryParam}, {description: queryParam},{tags: queryParam}]}
    }
    // by author
    if(req.query.author){
      query = {_author:req.query.author}
    }
    //pagination options
    var options = {
      sort:     { commentedAt: -1 },
      limit:    10,
      page: req.query.page || 1,
      populate: {path:'_author',select:'email'} // change back to user_name eventually
    };
    //get documents
    CodeDocument.paginate(query, options).then(function(result) {
      if(!result){return res.status(404).send('list of documents not found')}
      res.json(result.docs);
    });
  });


// GET A DOCUMENT
  app.get('/api/documents/:id', function(req,res){
    CodeDocument.findOne({_id:req.params.id})
      .populate('_author')
      .populate('comments')
      .populate({path:'comments', populate: {path:'_author',select:'email'}}) // change back to username
      .populate({path:'comments', populate: {path:'thanks.from',select:'email'}}) // change back to username
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

};

module.exports = documentRoutes;