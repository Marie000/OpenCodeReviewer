/**
 * Created by mariepelletier on 2017-01-17.
 */
let _ = require('lodash');
var User = require ('../models/user.js');


//update award to the right count
let updateBadge = function(user,name,count){
  let index = _.indexOf(user.points.awards, _.find(user.points.awards, {name:name}));
  if(index>-1 ){
    if(user.points.awards[index].count < count){
      user.points.awards[index].count = count;
      let newUser = new User(user);
      newUser.save();
    }
  } else {
    user.points.awards.push({name:name, count:count});
    let newUser = new User(user);
    newUser.save();
  }
};

let checkForBadges = function(user){
  // reviewer badges
  let reviewCount = user.points.reviews.length;
  if(reviewCount >= 10 && reviewCount <20 ) {
    updateBadge(user,'reviewer',1)
  } else if(reviewCount >=20 && reviewCount < 50){
    updateBadge(user,'reviewer',2)
  } else if(reviewCount>=50){
    updateBadge(user,'reviewer',3)
  }

  // coder badges
  let codeCount = user.code_docs.length;
  if(codeCount >=10 && codeCount <20) {
    updateBadge(user,'coder',1)
  } else if (codeCount >= 20 && codeCount<50) {
    updateBadge(user,'coder',2)
  } else if(codeCount>=50) {
    updateBadge(user,'coder',3)
  }

  // comment tag badges
  user.points.comment_tags.forEach(function(tag){
    if(tag.count >= 5 && tag.count <10){
      updateBadge(user,'reviewer-'+tag.name,1)
    } else if(tag.count >=10 && tag.count <20){
      updateBadge(user, 'reviewer-'+tag.name,2)
    } else if(tag.count>=20){
      updateBadge(user, 'reviewer-'+tag.name,3)
    }
  });

  //document tag badges
  user.points.code_document_tags.forEach(function(tag){
    if(tag.count >= 5 && tag.count <10){
      updateBadge(user,'coder-'+tag.name,1)
    } else if(tag.count >=10 && tag.count <20){
      updateBadge(user, 'coder-'+tag.name,2)
    } else if(tag.count>=20){
      updateBadge(user, 'coder-'+tag.name,3)
    }
  });

}




module.exports = checkForBadges;