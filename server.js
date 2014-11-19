var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Request handlers
// User authentication routes
var user = require('./server/users/user-controller.js');
// Data query routes
var data = require('./server/data/data-controllers.js');
var errors = require('./server/error-handlers.js');

var app = express();

// Python server connection
// var python = require('./server/python/pythonComm.js');

// // Email server notification
// var email = require('./server/problematic/rhythmNotification.js');
// email.arrhythmiaNotify('Chao', 'chao.xue.mit@gmail.com', null);

app.use(express.static(__dirname + '/client'));

// var python = require('./python/pythonComm.js');

// Sends some data to Python, Python squares it - this is simply part
// of testing the python connection and can be removed later
// python.invoke("processData", [1,2,3], function(error, res, more) {
//   if(error){
//     throw error;
//   } 
//   console.log(res);
// }); 

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
app.post('/users/data', data.getData);

// If there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

app.listen(process.env.PORT || '8080');
console.log("Server is listening...");

module.exports = app;
