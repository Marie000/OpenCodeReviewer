var mongoose = require('mongoose');
var validator = require('validator');
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
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
  facebook_url: {
    type: String,
    trim: true
  },
  github_username: {
    type: String,
    trim: true
  },
  github_url: {
    type: String,
    trim: true
  },
  twitter_url: {
    type: String,
    trim: true
  },
  linkedIn_url: {
    type: String,
    trim: true
  }

});

UserSchema.set('timestamps',true);
var User = mongoose.model('User',UserSchema);

module.exports = User;