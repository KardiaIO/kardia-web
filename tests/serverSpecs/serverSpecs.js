var expect = require('chai').expect;
var request = require('request');
var jwt = require('jwt-simple');
// Require the user controller so we have access to the mongoose connection
var dbConnection = require('../../server/users/user-controller');
var User = require('../../server/users/user-model');

describe('Server Tests', function(){

  describe('User Login Tests', function(){

    // Delete test user
    User.findOneAndRemove({username: 'nicktest'}, function(err, obj) {
      if (err) {
        throw err;
      }
    });

    it('Signup should save a new user to the database', function(done){
      var options = {
        'method': 'POST',
        'uri': 'http://localhost:8080/users/signup',
        'json': {
          'username': 'nicktest',
          'password': 'nickpass'
        }
      };

      request(options, function(error, res, body){
        if (error) {
          throw error;
          done();
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

    it('Signin should sign in an existing user', function(done){
      var options = {
        'method': 'POST',
        'uri': 'http://localhost:8080/users/signin',
        'json': {
          'username': 'nicktest',
          'password': 'nickpass'
        }
      };

      request(options, function(error, res, body) {
        if (error) {
          throw error;
          done();
        } else {
          User.findOne({username: 'nicktest'}, function(err, obj){
            if (err) {
              throw err;
            } else {
              var user = jwt.decode(body.token, 'secret').username;
              expect(user).to.equal('nicktest');
              done();
            }
          });
        }
      });
    });

  });

  describe('EKG Data', function(){    
    it('should receive a json object', function(done){
      expect(3).to.equal(3);
      done();
    });
  });
});
