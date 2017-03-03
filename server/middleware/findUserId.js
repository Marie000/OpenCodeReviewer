var User = require ('./../models/user');

var findUserId = function(req,res,next) {
  console.log(req.user.sub)
  User.findOne({Auth0:req.user.sub})
    .then(function(user){
      if(!user){res.status(404).send('user not found in middleware')}
      req.user._id=user._id;
      next();
    })
};

module.exports = findUserId;