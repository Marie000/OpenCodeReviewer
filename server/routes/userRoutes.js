var _ = require('lodash');
var User = require ('../models/user.js');
var getUserId = require('../middleware/findUserId');
var stormpath = require('express-stormpath');
var jwt = require('express-jwt');

var jwtCheck = jwt({
  secret: process.env.AUTH0SECRET || require('../../config').auth0secret,
  audience: process.env.AUTH0AUDIENCE || require('../../config').auth0audience
});


var userRoutes = function(app) {

  /*
// GET ALL USERS
// do I even need this? When would I need a list of users?
  // NOTE : should send only public information
  app.get('/api/users', authenticate, function(req,res){
    User.find({}).then(function(list){
      if(!list){return res.status(404).send('no users found')}
      res.json(list);
    })
  });
*/

// CREATE A NEW USER
  
  app.post('/api/users',function(req,res){
    User.findOne({Auth0:req.body.Auth0})
      .then((user)=> {
        if (user) {
          res.json(user)
        }
      });
    console.log(req.body);
    let user = new User(req.body)
    user.save()
      .then(res.json(user))
  });

// GET A USER

  // when user is logged in, get all information for that user (private and public)
  app.get('/api/users/me',jwtCheck, getUserId, function(req,res){
    console.log(req.user)
    User.findOne({_id: req.user._id}).then(function(user){
      if(!user){return res.status(404).send('user not found')}
      res.send(user);
    }).catch(function(err){
      res.status(400).send(err);
    })

  });

  // get only public information for a user
  app.get('/api/users/:email', function(req,res){
    console.log(req.params.email)
    User.findOne({email: req.params.email}).then(function(user){
      if(!user){ return res.status(404).send('user not found')}
      // pick public parts of the user object
      filteredUser = _.pick(user,
        ['first_name','middle_name','last_name','user_name','code_docs','comments','points','location','skills','facebook_url','twitter_url','linkedIn_url','github_url','github_username']);
      res.send(filteredUser);
    }).catch(function(err){
      res.status(400).send(err)
    })
  });

// UPDATE USER PROFILE
  app.patch('/api/users/me', jwtCheck, getUserId, function(req,res){
    // filter body to update only fields that exist
    var body = _.pick(req.body,['first_name','last_name','location','skills','facebook_url','twitter_url','linkedIn_url','github_url','github_username']);
    User.findOneAndUpdate({_id:req.user._id}, {$set: body}, {new:true}).then(function(user){
      res.send(user);
    }).catch(function(err){
      res.status(400).send(err)
    })
  });
  
};

module.exports = userRoutes;