var express = require ('express')
var bodyParser = require('body-parser');
var mongoose = require ('./database/mongoose.js');
var jwt = require('express-jwt');
var config = require('../config');
const socketIO = require('socket.io');
const http = require('http');
const websocket = require('../websocket');
var PORT = process.env.port || 9000;
var app = express();
var server = http.createServer(app);
 websocket.setSocket(server, socketIO);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../build/'));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000','http://checkmycode.ca', 'https://'+config.auth0url);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'x-auth, Content-Type, credentials, Authorization');
  next();
});

var userRoutes = require('./routes/userRoutes')(app);
var documentRoutes = require('./routes/documentRoutes')(app);
var commentRoutes = require('./routes/commentRoutes')(app);
var fileRoutes = require('./routes/fileRoutes')(app);

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, '/../build/','index.html'));
})

  server.listen(PORT,function(){
    console.log('server listening on port '+PORT);
  });
