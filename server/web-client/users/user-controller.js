// Starting mongoDB connection
var mongoose = require('mongoose');
var mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);

var User = require('./user-model.js'), // user-schema
    Q    = require('q'),  // promises library
    jwt  = require('jwt-simple'); // json web tokens

module.exports = {

  // Sign-in function
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          // Generates an error if user is not found in the system
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                // Responds with a token when the user is found in the system
                res.json({token: token});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signin

  // Sign-up function
  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        firstName = req.body.firstName,
        lastName = req.body.lastName,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // Check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          // Errors when when the user does already exist
          next(new Error('User already exist!'));
        } else {
          // Make a new user if one doesn't exist
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        // Create token to send back for auth using jwt
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
        // res.json ({
          // token: token
          // username: username
        // })
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signup

  // Checking to see if the user is authenticated
  // Grab the token in the header is any
  // then decode the token, which we end up being the user object
  // check to see if that user exists in the database
  checkAuth: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.sendStatus(200);
          } else {
            res.sendStatus(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }, //end checkAuth

  // This is the middleware function that will decode
  // the username that identifies the user from which
  // the incoming request is coming
  decode: function (req, res, next) {
    
    var token = req.headers['x-access-token'];
    var user;
    if (!token) {
      // Send forbidden if a token is not provided
      return res.sendStatus(403);
    }
    try {
      // Decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.username = user.username;
      next();
    } catch(error) {
      return next(error);
    }

  }//end decode

};
