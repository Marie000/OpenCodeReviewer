var bcrypt = require('bcryptjs');
var _ = require('lodash');
var User = require ('../models/user.js');
var authenticate = require('../middleware/authenticate.js');


var userRoutes = function(app) {

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
      res.json('new user created: '+doc.email);
    }).catch(function(err){
      res.status(400).send(err);
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


  app.get('/api/users/me',authenticate, function(req,res){
    // use auth token to get _id
    User.findOne({_id: req.user._id}).then(function(user){
      if(!user){return res.status(404).send('user not found')}
      res.send(user);
    }).catch(function(err){
      res.status(400).send(err);
    })

  });

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
    var body = req.body;
    User.findByIdAndUpdate(req.user._id, {$set: body}, {new:true}).then(function(user){
      res.send(user);
    }).catch(function(err){
      res.status(400).send(err)
    })
  });

  app.patch('/api/users/me/password',authenticate, function(req,res){
    // expects {'old_password':'string', 'new_password: 'other_string'}
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
}

module.exports = userRoutes;