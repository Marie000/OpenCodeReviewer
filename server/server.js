var express = require ('express')
var bodyParser = require('body-parser');
var mongoose = require ('./database/mongoose.js');
var stormpath = require('express-stormpath');

var PORT = process.env.port || 9000;
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../build/'));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'x-auth, Content-Type, credentials, x-stormpath-agent, X-Stormpath-Agent');
  next();
});

app.use(stormpath.init(app, {
  web: {
    produces: ['application/json'],
    register: {
      form: {
        fields: {
          username: {
            enabled: true,
            label: 'User Name',
            placeholder: 'unique username',
            required: true,
            unique: true,
            type: 'text'
          }
        }
      }
    }
  }

}));
var userRoutes = require('./routes/userRoutes')(app);
var documentRoutes = require('./routes/documentRoutes')(app);
var commentRoutes = require('./routes/commentRoutes')(app);

app.on('stormpath.ready', function() {
  console.log('stormpath ready')
  app.listen(PORT,function(){
    console.log('server listening on port '+PORT);
  });
});
