angular.module('ekg.api', [])

.controller('APIController', function ($scope, $window, $state, Auth) {
  
  $scope.user = {};

  $scope.generateKey = function() {
  	//return generated API key and store it to user's mongodb obj
  	//if already have an API key, hide button and show "Show API key" button instead
  	
  	console.log("Here's your API key! Keep it safe!");



  };

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        // The server should return a json web token if the user is successfully authenticated.
        // We will put this token into local storage.
        if (token) {
          $window.localStorage.setItem('com.ekgtracker', token);
        } else {
          alert('Username or password was incorrect. Please try again.');
        }
      })
      .catch(function (error) {
        alert('Error in signin function: ', error);
      });
  };

  $scope.signup = function () {
    var isValid = false;
    // The sign up function will perform the following checks in order: 
    // 1. Are the two passwords the same
    // 2. Is the email entered a valid email address
    // 3. Is the password more than 6 characteristics
    // 4. Did the user put something in the first and last name fields
    if ($scope.user.password === $scope.user.cpassword) {
      if ($scope.user.username.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        if ($scope.user.password.length >= 6) {
          if ($scope.user.first.length > 0 && $scope.user.last.length > 0){
            isValid = true;
          } else {
            alert('Please enter your first and last name.');
          }
        } else {
          alert('Your password needs to be at least 6 characters long.');
        }
      } else {
        alert('Your email address is invalid.');
      }
    } else {
      alert('Your passwords do not match.');
    }
    if (isValid){
      Auth.signup($scope.user)
        .then(function (token) {
          if (token) {
            $window.localStorage.setItem('com.ekgtracker', token);
          } else {
            alert('Your email is already registered.');
          }
        })
        .catch(function (error) {
          alert('Error in signup function: ', error);
        });
    }
  };

  $scope.isAuth = Auth.isAuth;

  $scope.signout = Auth.signout;

});