// DO NOT CHANGE THIS FILE UNLESS NECESSARY
// IF YOU DO CHANGE IT, NOTIFY THE PROJECT MANAGER

var mongoose = require ('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/CodeReviewAppTest');

module.exports = {mongoose: mongoose};
