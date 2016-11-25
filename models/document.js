var mongoose = require ('mongoose');
var IdObject = mongoose.Schema.Types.ObjectId;

var CodeDocSchema = mongoose.Schema({
  _author:{
    type: IdObject,
    required: true,
    ref: 'User'
  },
  title:{
    type: String,
    required: true,
    trim: true,
    minlength:1
  },
  tags:[{
    type: String
  }],
  //do I want to use a default value for dates?
  date_submitted: {
    type: Date,
  },
  date_edited: {
    type: Date
  },
  date_commented: {
    type: Date
  },
  open_for_review: {
    type: Boolean,
    default: true
  },
  text: {
    //content of object TBD ... will temporarily use a string
    type: String,
    require: true,
    trim: true,
    minlength: 1
  },
  comments: [{
    type: IdObject,
    ref: 'Comment'
  }]
});

var CodeDocument = mongoose.model('CodeDocument',CodeDocSchema);

module.exports = CodeDocument;