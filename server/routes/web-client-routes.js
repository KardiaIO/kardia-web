var express = require('express');
var webRouter = express.Router();

var user = require('../web-client/users/user-controller.js');
var data = require('../web-client/data/data-controllers.js');

module.exports = function(app) {

  webRouter.post('/users/signup', user.signup);
  webRouter.post('/users/signin', user.signin);
  webRouter.get('/users/signedin', user.checkAuth);

  // This route is for data queries
  webRouter.post('/users/data', data.getData);

  // If incoming request is not pinging a user authentication route
  // then we make sure they are signed in by getting the token from
  // the header
  app.use('/', webRouter);

  // This needs to be last
  app.use(user.decode);

};