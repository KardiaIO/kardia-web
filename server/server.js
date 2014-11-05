var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//serves the static contents in the client folder
app.use(express.static(__dirname + '/../client'));

//for every incoming request, the following will parse the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//listens to incoming requests
app.listen(process.env.PORT || '8080');
console.log("Server is listening...");

//exporting the express server
module.exports = app;