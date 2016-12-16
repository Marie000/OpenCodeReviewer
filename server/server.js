var express = require ('express')
var bodyParser = require('body-parser');
var mongoose = require ('./database/mongoose.js');

var PORT = process.env.port || 8080;
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/src/public'));

app.use(function (req, res, next) {
  console.log('middleware working')
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'x-auth, Content-Type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

var userRoutes = require('./routes/userRoutes')(app);
var documentRoutes = require('./routes/documentRoutes')(app);
var commentRoutes = require('./routes/commentRoutes')(app);

app.listen(PORT,function(){
  console.log('server listening on port '+PORT);
});