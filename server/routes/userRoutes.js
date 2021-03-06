var _ = require('lodash');
var User = require ('../models/user.js');
var getUserId = require('../middleware/findUserId');
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
    console.log(req.body)
    User.findOne({Auth0:req.body.Auth0})
      .then((user)=> {
        if (user) {
          res.json(user)
        } else {
          let newUser = new User(req.body);
          newUser.save()
            .then(res.json(newUser))
        }
      });
  });

// GET A USER

  // when user is logged in, get all information for that user (private and public)
  app.get('/api/users/me',jwtCheck, getUserId, function(req,res){
    User.findOne({_id: req.user._id}).then(function(user){
      if(!user){return res.status(404).send('user not found')}
      res.send(user);
    }).catch(function(err){
      res.status(400).send(err);
    })

  });
  


  // get only public information for a user
  app.get('/api/users/:username', function(req,res){
    User.findOne({username: req.params.username}).then(function(user){
      if(!user){ return res.status(404).send('user not found')}
      // pick public parts of the user object
      filteredUser = _.pick(user,
        ['first_name','middle_name','last_name','user_name','code_docs','comments','points','location','skills','facebook_url','twitter_url','linkedIn_url','github_url','github_username']);
      res.send(filteredUser);
    }).catch(function(err){
      res.status(400).send(err)
    })
  });

  // get all documents a user commented on
  app.get('/api/users/:username/reviews',function(req,res){

    User.findOne({username:req.params.username})
      .populate('points.reviews')
      .populate({path:'points.reviews', populate: {path:'_author',select:'username'}})
      .then(function(user){
        if(!user){ return res.status(404).send('user not found')}
        res.json(user.points.reviews)
    })
  })

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