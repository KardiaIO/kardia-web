var express = require('express'); // express server
var bodyParser = require('body-parser'); // use body-parser for getting body of incoming requests
var mongoose = require('mongoose'); // use mongoose for user authentication routes

// request handlers
var user = require('./users/user-controller.js'); // user authentication routes
// var data = require('./data/data-controllers.js'); // data query routes
var errors = require('./error-handlers.js');

var app = express();

// Python server connection
var python = require('./python/pythonComm.js');

// sends some data to Python, Python squares it - this is simply part
// of testing the python connection and can be removed later
python.invoke("processData", [1,2,3], function(error, res, more) {
  if(error){
    throw error;
  } 
  console.log(res);
}); 

// starting mongoDB connection
var mongoUrl = process.env.PORT ? "mongodb://webEKGAPI:yhXk8EPXDSfy@ds051160.mongolab.com:51160/ekgapi" : 'mongodb://localhost/ekgtracker';

mongoose.connect(mongoUrl);

// serves the static contents in the client folder
app.use(express.static(__dirname + '/../client'));

// for every incoming request, the following will parse the 
// body of the request for its contents before passing them
// off to other request handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// user-authentication routes, handles signin, signup, and checkAuth
app.post('/users/signin', user.signin);
app.post('/users/signup', user.signup);
app.get('/users/signedin', user.checkAuth);

// if incoming request is not pinging a user authentication route
// then we make sure they are signed in by getting the token from
// the header
app.use(user.decode);

// these routes are for data queries
// app.get('/users/data', data.getData);

// if there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

// listens to incoming requests
app.listen(process.env.PORT || '8080');
console.log("Server is listening...");

// exporting the express server
module.exports = app;
