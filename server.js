var express = require ('express')
var bodyParser = require('body-parser');
var mongoose = require ('./database/mongoose.js');

var PORT = 8080;
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/src/public'));

var userRoutes = require('./routes/userRoutes')(app);
var documentRoutes = require('./routes/documentRoutes')(app);
var commentRoutes = require('./routes/commentRoutes')(app);

app.listen(PORT,function(){
  console.log('server listening on port '+PORT);
});