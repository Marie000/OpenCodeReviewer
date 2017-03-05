var _ = require('lodash');

var CodeDocument = require ('../models/document.js');
var User = require ('../models/user.js');
var findUserId = require('../middleware/findUserId');
var File = require('../models/file');

var fileRoutes = function(app){
  
  app.get('/api/files/:id',function(req,res){
    File.findById(req.params.id)
      .populate('children')
      .populate('comments')
      .populate({path:'comments',populate:{path:'_author', select:'email'}})
     // .populate({path:'children', populate: {path:'comments'}})
      .then(function(file){
        if(!file){res.status(404).send('file not found')}
        File.find({_parent:file._id})
          .populate('comments')
          .populate({path:'comments',populate:{path:'_author', select:'email'}})
          .then((children)=>{
            let newfile = file.toObject()
            newfile.children=children
            res.json(newfile)
          })
      })
  })
  
  app.post('/api/files',function(req,res){
    console.log(req.body);
    var newFile = new File(req.body)
    newFile.save().then((file)=>{res.json(file)})

  })
  
  
}

module.exports = fileRoutes;