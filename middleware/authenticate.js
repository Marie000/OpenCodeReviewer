var User = require ('./../models/user');

var authenticate = function(req,res,next) {
  var token = req.header('x-auth');
  User.findByToken(token).then(function(user){
    if(!user){
      return res.status(404).send('no user found for this token')
    }
    req.user = user;
    req.token = token;
    next();
  }).catch(function(error){
    res.status(401).send(error);
  })
};

module.exports = authenticate;