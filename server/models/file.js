var mongoose = require ('mongoose');
var IdObject = mongoose.Schema.Types.ObjectId;

var FileSchema = mongoose.Schema({
  is_folder:{
    type:Boolean,
    required:true
  },
  name:{
    type: String,
    required: true,
    trim: true,
    minlength:1
  },
  text: {
    type: String,
    trim: true
  },
  comments: [{
    type: IdObject,
    ref: 'Comment'
  }],
  language: {
    type: String,
    default:'text'
  },
  _parent: {
    type: IdObject,
    required:true
  },
  _document: {
    type: IdObject
  }
});
FileSchema.set('timestamps',true);

var File = mongoose.model('File',FileSchema);

module.exports = File;