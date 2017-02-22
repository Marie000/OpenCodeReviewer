var _ = require('lodash');
var stormpath = require('express-stormpath');

var CodeDocument = require ('../models/document.js');
var User = require ('../models/user.js');
var findUserId = require('../middleware/findUserId');
var File = require('../models/file');

var fileRoutes = function(app){
  
  app.get('/api/files/:id',function(req,res){
    File.findById(req.params.id)
      .populate('children')
      .populate('comments')
      .populate({path:'children', populate: {path:'comments'}})
      .then(function(file){
        if(!file){res.status(404).send('file not found')}
        res.json(file);
      })
  })
  
  app.post('/api/files',function(req,res){
    var newFile = new File(req.body);
    newFile.save()
  })
  
  
}

module.exports = fileRoutes;