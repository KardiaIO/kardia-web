var express = require('express'); // express server
var bodyParser = require('body-parser'); // use body-parser for getting body of incoming requests
var mongoose = require('mongoose'); // use mongoose for user authentication routes

// request handlers
var user = require('./users/user-controller.js'); // user authentication routes

var app = express();

// starting mongoDB connection
var mongoUrl = process.env.PORT ? "INSERT mongolabs url here" : 'mongodb://localhost/ekgtracker';
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

// listens to incoming requests
app.listen(process.env.PORT || '8080');

// exporting the express server
module.exports = app;