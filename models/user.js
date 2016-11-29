var mongoose = require('mongoose');
var validator = require('validator');
var ObjectId = mongoose.Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');
var config = require('../config.js');
var jwt = require('jsonwebtoken');

var UserSchema = mongoose.Schema({
  email:{
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  tokens: [{
    auth: {
      type: String
    },
    token: {
      type: String
    }
  }],
  first_name: {
    type: String
  },
  middle_name: {
    type: String
  },
  last_name: {
    type: String
  },
  user_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  code_docs: [
    {
      type: ObjectId,
      ref: 'Code_Document'
    }
  ],
  comments: [
    {
      type : ObjectId,
      ref: 'Comment'
    }
  ],
  points:{
    reviews:[
      {
        type: ObjectId,
        ref: 'Code_Document'
      }
    ],
    thanks: [
      {
        for_comment:{
          type: ObjectId,
          ref: 'Comment'
        },
        from: {
          type: ObjectId,
          ref: 'User'
        },
        date: {
          type: Date
        }
      }
    ],
    code_document_tags: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          minlength: 1
        },
        count: {
          type: Number,
          required: true
        }
      }
    ],
    comment_tags: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          minlength: 1
        },
        count: {
          type: Number,
          required: true
        }
      }
    ],
    awards: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          minlength: 1
        },
        count: {
          type: Number,
          required: true
        }
      }
    ]
  },
  location: {
    type: String
  },
  skills: [{
    skill: {
      type: String
    },
    experience_level: {
      type: String
    }
  }],
  contact_info: {
    public_email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    social_media: [{
      media: {
        type: String,
        //required: true,
        trim: true,
        minlength: 1
      },
      url: {
        type: String,
        validate: {
          validator: validator.isURL,
          message: '{VALUE} is not a valid url'
        },
        //required: true,
        minlength: 1
      }
    }]
  }
});

// if password is modified, hash before save()
UserSchema.pre('save', function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10, function(err,salt){
      bcrypt.hash(user.password, salt, function(err,hash){
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
});

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token,config.secret)
  } catch(e) {
    return Promise.reject('verify did not work');
  }
  return User.findOne({_id:decoded._id, 'tokens.token':token, 'tokens.auth':'auth'});
};

UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var token = jwt.sign({_id:user._id.toHexString(), auth:'auth'},config.secret).toString();
  user.tokens.push({auth: 'auth', token: token});
  return user.save().then(function(){
    return token;
  })
};
UserSchema.set('timestamps',true);
var User = mongoose.model('User',UserSchema);

module.exports = User;