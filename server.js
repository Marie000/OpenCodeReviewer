var express = require ('express')
var bodyParser = require('body-parser');
var mongoose = require ('./database/mongoose.js');
var bcrypt = require('bcryptjs');
// models
var User = require ('./models/user.js');
var CodeDocument = require ('./models/document.js');
var Comment = require('./models/comment.js');
// middleware
var authenticate = require('./middleware/authenticate.js');
var authenticateAuthor = require('./middleware/authenticate-author.js');

var PORT = 8080;
var app = express();

app.use(bodyParser.json());

app.get('/',function(req,res){
  res.send('hello world')
});

/** USERS **/

// GET ALL USERS
// do I even need this? When would I need a list of users?
// require authentication - send only relevant information
app.get('/api/users', authenticate, function(req,res){
  User.find({}).then(function(list){
    // is this necessary?   if(!list){return res.status(404).send('no users found')}
    res.send(JSON.stringify(list));
  })
});

// CREATE A NEW USER
app.post('/api/users',function(req,res){
  var newUser = new User(req.body);
  // add encryption
  newUser.save().then(function(doc){
    // send auth token to log in (that can wait)
    res.send('new user created: '+doc.email);
  }).catch(function(err){
    res.status(400);
  });
});

// LOGIN
app.post('/api/login',function(req,res){
  User.findOne({email: req.body.email}).then(function(user){
    if(!user){return res.status(400).send('email not found')}
    bcrypt.compare(req.body.password, user.password, function(err, response){
      if(response){
        user.generateAuthToken().then(function(token){
          res.header('x-auth', token).send(user)
        })
      } else {
        return res.status(400).send('wrong password')
      }
    })
  })
})

// GET A USER
app.get('/api/users/:id', function(req,res){
  User.findOne({_id: req.params.id}).then(function(user){
    if(!user){ return res.status(404).send('user not found')}
    // pick public parts of the user object

    res.send(user);
  })
});

app.get('/api/users/me',authenticate, function(req,res){
  // use auth token to get _id
  // find user by this id
  // return all info - public and private
  res.send(req.user);
})

// UPDATE USER PROFILE


// UPDATE POINTS FOR USER


/** CODE DOCUMENTS **/

// GET ALL DOCUMENTS
// add pagination - display most recent only - wait until after MVP?
app.get('/api/documents', function(req,res){
  CodeDocument.find({}).then(function(list){
    res.send(JSON.stringify(list));
  })
});

// GET DOCUMENTS BY TAGS ??

// GET DOCUMENTS BY SEARCH ??

// GET A DOCUMENT
app.get('/api/documents/:id', function(req,res){
  CodeDocument.findOne({_id:req.params.id}).populate('author').populate('comments').then(function(doc){
    if(!doc){return res.status(404).send('document not found');}
    res.send(doc)
  })
});

// CREATE A DOCUMENT
app.post('/api/documents', authenticate, function(req,res){
  //create a document
  var newDoc = new CodeDocument(req.body);
  newDoc.author = req.user._id
  newDoc.save().then(function(doc){
    // add document id to the author's document list
    User.findByIdAndUpdate(
      doc.author,
      {$push: {'code_docs': doc._id}},
      {safe: true, new: true}
    ).then(function(author){
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


/** COMMENTS **/

// CREATE A COMMENT
app.post('/api/comments/', authenticate, function(req,res){
  // IMPORTANT: pass in the code document id in the request somehow.
  // add comment to code document
  // NOTE: author does not need to be passed in the body - author will be authenticated user
  var body = req.body;
  body.author = req.user._id;
  var newComment = new Comment(req.body);
  newComment.save().then(function(comment){
    // add comment id to the author's comment list
    User.findByIdAndUpdate(
      comment.author,
      {$push: {'comments': comment._id}},
      {safe: true, new: true}
    ).then(function(author){
      if(!author){return res.status(404).send('author not found')}
    });
    // add comment id to the document's comment list
    CodeDocument.findByIdAndUpdate(
      comment.documentId,
      {$push: {'comments': comment._id}},
      {safe: true, new: true}
    ).then(function(document){
      if(!document){return res.status(404).send('document not found')}
      else {res.send('comment added')}
    })
    
  }).catch(function(err){
    res.status(400);
  });
  /*
  CodeDocument.findByIdAndUpdate(
    doc_id,
    {$push: {"comments": body}},
    {safe: true, new: true}).then(function(doc){
    if(!doc){return res.status(404).send('document not found')}
    // add comment id to author's list of comments
    var user_id = req.body.author;
    User.findByIdAndUpdate(
      user_id,
      {$push: {"comments": doc._id}},
      {safe: true, new: true}).then(function(author){
      if(!author){return res.status(404).send('author not found')}
      res.send(author)
    })
  }).catch(function(err){
    res.status(400);
  })
  */

});

// DELETE A COMMENT
app.delete('/api/comments/:comment_id', authenticate, authenticateAuthor, function(req,res){
  res.send('trying to delete')
});

// EDIT A COMMENT
app.put('/api/comments/:comment_id', authenticate, authenticateAuthor, function(req,res){
  res.send('trying to edit')
});


app.listen(PORT,function(){
  console.log('server listening on port '+PORT);
});