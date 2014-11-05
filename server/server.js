var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//serves the static page
app.use(express.static(__dirname + '/../client'));

//parses all requests for its body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//listening to requests
app.listen(process.env.PORT || 8080);
//exporting the express server
module.exports = app;