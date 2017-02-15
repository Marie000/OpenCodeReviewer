var User = require ('./../models/user');


var findUserId = function(req,res,next) {
  User.findOne({user_name:req.user.username})
    .then(function(user){
      if(!user){res.status(404).send('user not found for author field')}
      req.user._id=user._id;
      next();
    })
};

module.exports = findUserId;