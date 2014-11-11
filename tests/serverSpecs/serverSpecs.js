var expect = require('chai').expect;
var request = require('request');
var jwt = require('jwt-simple');
// Require server.js so we have access to the mongoose connection
var dbConnection = require('../../server/server');
var User = require('../../server/users/user-model');

describe('Server Tests', function(){

  beforeEach(function(){

    // Delete test users
    User.findOneAndRemove({username: 'nicktest'}, function(err, obj) {
      if (err) {
        throw err;
      }
    });
  });

  it('Signup should save a new user to the database', function(done){
    var options = {
      'method': 'POST',
      'uri': process.env.PORT ? 'http://ekgwebapp.heroku.com/users/signup', 'http://localhost:8080/users/signup',
      'json': {
        'username': 'nicktest',
        'password': 'nickpass'
      }
    };

    request(options, function(error, res, body){
      if (error) {
        throw error;
      } else {
        User.findOne({username: 'nicktest'}, function(err, obj){
          if (err) {
            throw err;
          } else if (body && body.token) {
            var user = jwt.decode(body.token, 'secret').username;
            expect(user).to.equal('nicktest');
            done();
          }
        });
      }
    });

  });

  xit('should sign in an existing user', function(done){
    
    done();
  });

  xit('should logout a user that is signed in', function(done){
    
    done();
  });
});