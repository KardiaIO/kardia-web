var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Request handlers
// user authentication routes
var user = require('./users/user-controller.js');
// Data query routes
// var data = require('./data/data-controllers.js');
var errors = require('./error-handlers.js');

var app = express();

// Python server connection
// var python = require('./python/pythonComm.js');

// Sends some data to Python, Python squares it - this is simply part
// of testing the python connection and can be removed later
// python.invoke("processData", [1,2,3], function(error, res, more) {
  // if(error){
    // throw error;
//   } 
//   console.log(res);
// }); 


// MongoDB connection
var mongoUrl = process.env.PORT ? "mongodb://webEKGAPI:yhXk8EPXDSfy@ds051160.mongolab.com:51160/ekgapi" : 'mongodb://localhost/ekgtracker';

mongoose.connect(mongoUrl);

app.use(express.static(__dirname + '/../client'));

// For every incoming request, the following will parse the 
// body of the request for its contents before passing them
// off to the other request handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// User-authentication routes, handles signin, signup, and checkAuth
app.post('/users/signin', user.signin);
app.post('/users/signup', user.signup);
app.get('/users/signedin', user.checkAuth);

// If incoming request is not pinging a user authentication route
// then we make sure they are signed in by getting the token from
// the header
app.use(user.decode);

// These routes are for data queries
// app.get('/users/data', data.getData);

// If there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

app.listen(process.env.PORT || '8080');
console.log("Server is listening...");

module.exports = app;
