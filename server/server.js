var express = require('express'); // express server
var bodyParser = require('body-parser'); // use body-parser for getting body of incoming requests

// request handlers
var user = require('./users/user-controller.js'); // user authentication routes
var data = require('./data/data-controllers.js'); // data query routes
var errors = require('./error-handlers.js'); // error handlers

var app = express();

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
app.get('/users/data', data.getData);

// if there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

// listens to incoming requests
app.listen(process.env.PORT || '8080');
console.log("Server is listening...");

// exporting the express server
module.exports = app;
