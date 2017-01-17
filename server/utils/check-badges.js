/**
 * Created by mariepelletier on 2017-01-17.
 */
let _ = require('lodash');

//update award to the right count
let updateBadge = function(user,name,count){
  let index = _.indexOf(user.points.awards, _.find(user.points.awards, {name:name}));
  if(index>-1){
    user.points.awards[index].count = count;
  } else {
    user.points.awards.push({name:name, count:count})
  }
};

let checkForBadges = function(user){
  // reviewer badges
  let reviewCount = user.points.reviews.length;
  if(reviewCount >= 10 && reviewCount <20 ) {
    updateBadge(user,'reviewer',1)
  } else if(reviewCount < 50){
    updateBadge(user,'reviewer',2)
  } else {
    updateBadge(user,'reviewer',3)
  }

  // coder badges
  let codeCount = user.code_docs.length;
  if(codeCount >=10 && codeCount <20) {
    updateBadge(user,'coder',1)
  } else if (reviewCount<50) {
    updateBadge(user,'coder',2)
  } else {
    updateBadge(user,'coder',3)
  }
}

module.exports = checkForBadges;