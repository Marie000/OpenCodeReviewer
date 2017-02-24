var mongoose = require ('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var CommentSchema = mongoose.Schema({
  _author: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    // string or object?
  },
  is_general: {
    type: Boolean,
    required: true
  },
  thanks: [{
    from: {
      type: ObjectId,
      ref: 'User'
    },
    date: {
      type: Date
    }
  }],
  position: {
    firstLine : {
      type: Number
    },
    lastLine : {
      type: Number
    }
  },
  _document_id: {
    type: ObjectId,
    ref: 'CodeDocument'
  },
  _file_id: {
    type: ObjectId,
    ref: 'File'
  }
});
CommentSchema.set('timestamps',true);
var Comment = mongoose.model('Comment',CommentSchema);

module.exports = Comment;
