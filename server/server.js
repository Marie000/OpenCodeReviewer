var express = require ('express')
var bodyParser = require('body-parser');
var mongoose = require ('./database/mongoose.js');
var cookieParser = require('cookie-parser');

var PORT = process.env.port || 9000;
var app = express();

app.use(bodyParser.json());
/*app.use(express.static(__dirname + '/src/public'));
app.use(cookieParser()); */
app.use(express.static(__dirname + '/../build/'));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); //only while we develop, should be deleted later

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'x-auth, Content-Type, credentials');
  next();
});

app.use(function(req,res,next){
  app.locals.user=req.user || null;
  next();
});

var userRoutes = require('./routes/userRoutes')(app);
var documentRoutes = require('./routes/documentRoutes')(app);
var commentRoutes = require('./routes/commentRoutes')(app);

app.listen(PORT,function(){
  console.log('server listening on port '+PORT);
});