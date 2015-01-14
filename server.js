// Load private .env variables immediately on development only.  Dokku runs its own config on production.
if (process.env.NODE_ENV === 'development') {
  var dotenv = require('dotenv');
  dotenv.load();
}

var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var errors = require('./server/error-handlers.js');
var threeScale = require('3scale').Client;
var sys = require('sys');
var cloudinary = require('cloudinary');

// Sets up Cloudinary Images 
cloudinary.config({ 
  cloud_name: 'kardia-io', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var app = express();

// 3scale
var threeScaleClient = new threeScale(process.env.THREE_SCALE_CLIENT);
threeScaleClient.authrep({"app_id": process.env.THREE_SCALE_APP_ID, "app_key": process.env.THREE_SCALE_APP_KEY, "usage": { "hits": 1 } }, function(response){
  sys.log(sys.inspect(response));
});

// Placeholder for socket.io functionality
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Python server connection
require('./server/python/pythonComm.js')(io);

// Email server notification
// var email = require('./server/problematic/rhythmNotification.js');
// email.arrhythmiaNotify('Chao', 'chao.xue.mit@gmail.com', null);

app.use(express.static(__dirname + '/client'));
app.use(favicon(__dirname + '/favicon.ico'));

// For every incoming request, the following will parse the 
// body of the request for its contents before passing them
// off to the other request handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
require('./server/routes/web-client-routes')(app);

// If there are errors from the server, use these to send back the errors
app.use(errors.errorLogger);
app.use(errors.errorHandler);

var port = process.env.PORT || 8080;
server.listen(port);

console.log("Server is listening on port",port);

module.exports = app;
