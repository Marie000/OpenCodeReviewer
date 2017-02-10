var _ = require('lodash');
var User = require ('../models/user.js');
var taglist = require('../../src/services/tag-list.js');


//Documents:
var giveTagPoints = function(document,user,isNewDoc){
    if(document.tags){
      document.tags.forEach(function(item){
        if(taglist.indexOf(item)>-1) {
          var index;
          if (isNewDoc) {
            index = _.indexOf(user.points.code_document_tags, _.find(user.points.code_document_tags, {name: item}));
          } else {
            index = _.indexOf(user.points.comment_tags, _.find(user.points.comment_tags, {name: item}));
          }
          if (index > -1) {
            if (isNewDoc) {
              user.points.code_document_tags[index].count++
            } else {
              user.points.comment_tags[index].count++
            }
            //var newUser = new User(user);
            //newUser.save();
            User.update({_id:user._id},{ $set: { points: user.points }}, function(){
              console.log('done!')
            })

          } else {
            if (isNewDoc) {
              user.points.code_document_tags.push({name: item, count: 1})
            } else {
              user.points.comment_tags.push({name: item, count: 1})
            }
            //var newUser = new User(user);
            //newUser.save();
            User.update({_id:user._id},{ $set: { points: user.points }}, function(){
              console.log('done!!')
            })
          }
        }
      })
    }
}


module.exports = giveTagPoints;