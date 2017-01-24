var _ = require('lodash');

var CodeDocument = require ('../models/document.js');
var authenticate = require('../middleware/authenticate.js');
var User = require ('../models/user.js');

var checkForBadges = require('../utils/check-badges.js');
var giveTagPoints = require('../utils/tag-points.js');

var documentRoutes = function(app){

// GET ALL DOCUMENTS
// add pagination - display most recent only
  app.get('/api/documents', function(req,res){
    var query   = {};
    if(req.query.tag){
      query = {tags:req.query.tag}
    }
    if(req.query.search){
      query = {$or:[{title:{ "$regex": req.query.search, "$options": "i" }}, {description: { "$regex": req.query.search, "$options":"i"}}]}
    }
    var options = {
      sort:     { commentedAt: -1 },
      limit:    10,
      page: req.query.page || 1,
      populate: {path:'_author',select:'user_name'}
    };
    CodeDocument.paginate(query, options).then(function(result) {
      if(!result){return res.status(404).send('list of documents not found')}
      res.json(result.docs);
    });
  });

// GET DOCUMENTS BY TAGS ??

// GET DOCUMENTS BY SEARCH ??

// GET A DOCUMENT
  app.get('/api/documents/:id', function(req,res){
    var publicInfo = {first_name:1, middle_name:1,last_name:1,user_name:1,points:1,location:1, skills:1, code_documents:1,comments:1}
    CodeDocument.findOne({_id:req.params.id})
      .populate('_author',publicInfo)
      .populate('comments')
      .populate({path:'comments', populate: {path:'_author',publicInfo}})
      .then(function(doc){
        if(!doc){return res.status(404).send('document not found')}
        res.json(doc);
      })
  });

// CREATE A DOCUMENT
  app.post('/api/documents', authenticate, function(req,res){
    //create a document
    var newDoc = new CodeDocument(req.body);
    newDoc._author = req.user._id;
    newDoc.commentedAt = Date.now();
    newDoc.save().then(function(doc){
      // add document id to the author's document list
      User.findByIdAndUpdate(
        doc._author,
        {$push: {'code_docs': doc._id}},
        {safe: true, new: true}
      ).then(function(author){
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