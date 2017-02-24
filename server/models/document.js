var mongoose = require ('mongoose');
var mongoosePaginate = require('mongoose-paginate');
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
  description:{
    type: String,
    trim: true
  },
  tags:[{
    type: String,
    trim: true
  }],
  editedAt: {
    type: Date
  },
  commentedAt: {
    type: Date
  },
  open_for_review: {
    type: Boolean,
    default: true
  },
  text: {
    type: String
  },
  comments: [{
    type: IdObject,
    ref: 'Comment'
  }],
  language: {
    type: String,
    default:'text'
  },
  multi_files: {
    type:Boolean,
    default:false
  }
});

CodeDocSchema.set('timestamps',true);
CodeDocSchema.plugin(mongoosePaginate);

var CodeDocument = mongoose.model('CodeDocument',CodeDocSchema);

module.exports = CodeDocument;