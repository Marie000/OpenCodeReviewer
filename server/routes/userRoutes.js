var bcrypt = require('bcryptjs');
var _ = require('lodash');
var User = require ('../models/user.js');
var authenticate = require('../middleware/authenticate.js');
var cookieParser = require('cookie-parser');


var userRoutes = function(app) {
app.use(cookieParser());

// GET ALL USERS
// do I even need this? When would I need a list of users?
  // NOTE : should send only public information
  app.get('/api/users', authenticate, function(req,res){
    User.find({}).then(function(list){
      if(!list){return res.status(404).send('no users found')}
      res.json(list);
    })
  });

// CREATE A NEW USER
  app.post('/api/users',function(req,res){
    var newUser = new User(req.body);
    newUser.save().then(function(doc){
      // send auth token to log in (that can wait)
      res.json('new user created: '+doc.email);
    }).catch(function(err){
      res.status(400).send(err);
    });
  });

// LOGIN
  app.post('/api/login',function(req,res){
    User.findOne({email: req.body.email}).then(function(user){
      if(!user){return res.status(400).send('Login error')}
        var loggedUser={
          _id:user._id, 
          user_name:user.user_name, 
          first_name:user.first_name}
        bcrypt.compare(req.body.password, user.password, function(err, response){
          if(response){
            user.generateAuthToken().then(function(token){
            res.cookie('token', token, {httpOnly: true}).send(loggedUser);
            })
          } else {
            return res.status(400).send('Login error')
          }
        })
    })
  });

  // LOGOUT
  app.delete('/api/logout', authenticate, function(req,res){
    User.findOne({_id:req.user._id}).then(function(user){
      if(!user){return res.status(404).send('user not found')}
 //     user.tokens=[];
      console.log('found user');
      res.cookie('token', "", {httpOnly: true, expires : new Date(Date.now() - 3600000)});
      user.save();
      res.json(user);
    })
  })

// GET A USER

  // when user is logged in, get all information for that user (private and public)
  app.get('/api/users/me',authenticate, function(req,res){
    User.findOne({_id: req.user._id}).then(function(user){
      if(!user){return res.status(404).send('user not found')}
      res.send(user);
    }).catch(function(err){
      res.status(400).send(err);
    })

  });

  // get only public information for a user
  app.get('/api/users/:id', function(req,res){
    User.findOne({_id: req.params.id}).then(function(user){
      if(!user){ return res.status(404).send('user not found')}
      // pick public parts of the user object
      filteredUser = _.pick(user,
        ['first_name','middle_name','last_name','user_name','code_docs','comments','points','location','skills','contact_info']);
      res.send(filteredUser);
    }).catch(function(err){
      res.status(400).send(err)
    })
  });

// UPDATE USER PROFILE
  app.patch('/api/users/me', authenticate, function(req,res){
    // filter body to updated only fields that exist!
    var body = req.body;
    User.findByIdAndUpdate(req.user._id, {$set: body}, {new:true}).then(function(user){
      res.send(user);
    }).catch(function(err){
      res.status(400).send(err)
    })
  });

  // UPDATE USER PASSWORD
  app.patch('/api/users/me/password',authenticate, function(req,res){
    var user = req.user;
    bcrypt.compare(req.body.old_password, user.password, function(err, response){
      if(response){
        user.password = req.body.new_password;
        user.save().then(function(user){
          res.send(user);
        })
      } else {
        return res.status(400).send('wrong password')
      }
    })
  })
};

module.exports = userRoutes;