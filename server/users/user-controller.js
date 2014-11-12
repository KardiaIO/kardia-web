// starting mongoDB connection
var mongoose = require('mongoose');
var mongoUrl = process.env.PORT ? "mongodb://webEKGAPI:yhXk8EPXDSfy@ds051160.mongolab.com:51160/ekgapi" : 'mongodb://localhost/ekgtracker';
mongoose.connect(mongoUrl);

var User = require('./user-model.js'), // user-schema
    Q    = require('q'),  // promises library
    jwt  = require('jwt-simple'); // json web tokens

module.exports = {

  // sign-in function
  signin: function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function (user) {
        if (!user) {
          // generates an error if user is not found in the system
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                // responds with a token when the user is found in the system
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

  // sign-up function
  signup: function (req, res, next) {
    var username  = req.body.username,
        password  = req.body.password,
        create,
        newUser;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          // errors when when the user does already exist
          next(new Error('User already exist!'));
        } else {
          // make a new user if one doesn't exist
          create = Q.nbind(User.create, User);
          newUser = {
            username: username,
            password: password
          };
          return create(newUser);
        }
      })
      .then(function (user) {
        // create token to send back for auth using jwt
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  }, //end signup

  // checking to see if the user is authenticated
  // grab the token in the header is any
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
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }, //end checkAuth

  // this is the middleware function that will decode
  // the username that identifies the user from which
  // the incoming request is coming
  decode: function (req, res, next) {
    
    var token = req.headers['x-access-token'];
    var user;
    if (!token) {
      // send forbidden if a token is not provided
      return res.sendStatus(403); 
    }
    try {
      // decode token and attach user to the request
      // for use inside our controllers
      user = jwt.decode(token, 'secret');
      req.username = user.username;
      next();
    } catch(error) {
      return next(error);
    }

  }//end decode

};
