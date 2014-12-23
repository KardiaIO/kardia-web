var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var uuid = require('node-uuid');
var bcrypt   = require('bcrypt-nodejs');

var model = require('./server/users/user-model');
// Request handlers
// User authentication routes
var user = require('./server/users/user-controller.js');
// Data query routes
var data = require('./server/data/data-controllers.js');
var errors = require('./server/error-handlers.js');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log('new connection');
  socket.on('rawData', function (data) {
    console.log(data);
  });
});

//Python server connection
// var python = require('./server/python/pythonComm.js');

// // Email server notification
// var email = require('./server/problematic/rhythmNotification.js');
// email.arrhythmiaNotify('Chao', 'chao.xue.mit@gmail.com', null);

app.use(express.static(__dirname + '/client'));
app.use(favicon(__dirname + '/favicon.ico'));

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

// This route is for data queries
app.post('/users/data', data.getData);

// This route is for data analysis results
app.post('/users/analysis', data.getAnalysisResults);
app.post('/users/lorenz', data.getLorenzResults);

// This route is for generating api key pairs and storing them into the DB
app.get('/api/keys', user.decode, function(req, res){
  
  var keyPair = {
	id: uuid.v4(),
	secret: uuid.v4(),
  };

  model.findOne({username : req.username}, function(err, foundUser) {
  	if (err) {
  	  res.sendStatus(403);
  	} else {
  	  var salt = foundUser.salt;
  	  bcrypt.hash(keyPair.secret, salt, null, function(err, hash) {
        if (err) {
          res.sendStatus(403);
        } else {
		  model.update({username: req.username}, {"APIKey" : keyPair.id, "SecureID" : hash }, function(err, numAffected, raw) {
	        if (err) {
		      res.send(403);
		    } else {
			  res.send(keyPair);
		    }
		  });	
        }
      });	
  	}
  }) 
});

// If there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

var port = process.env.PORT || '8080'
// app.listen(port);
server.listen(port);

console.log("Server is listening on port",port);

module.exports = app;
