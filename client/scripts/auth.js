angular.module('ekg.auth', [

])

.controller('AuthController', function ($scope, $window, $state, Auth) {

  $scope.user = {};

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (token) {
        if (token) {
          $window.localStorage.setItem('com.ekgtracker', token);
          $state.transitionTo('home');
        } else {
          $state.transitionTo('/signin');
          alert('Username or password was incorrect. Please try again.');
        }
      })
      .catch(function (error) {
        alert('Error in signin function: ', error);
      });
  };

  $scope.signup = function (isValid) {
    if (isValid){
      Auth.signup($scope.user)
        .then(function (token) {
          if (token) {
            $window.localStorage.setItem('com.ekgtracker', token);
            $state.transitionTo('home');
          } else {
            $state.transitionTo('/signup');
            alert('Username is already taken. Please select different username.');
          }
        })
        .catch(function (error) {
          alert('Error in signup function: ', error);
        });
    } else {
      $state.transitionTo('/signup');
      alert('Username must be between 4 and 140 characters long and password must be between 8 and 140 characters long.');
    }
  };

})

.factory('Auth', function ($http, $state, $window) {
 
   var signin = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signin',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var signup = function (user) {
    return $http({
      method: 'POST',
      url: '/users/signup',
      data: user
    })
    .then(function (resp) {
      return resp.data.token;
    });
  };

  var isAuth = function () {
    return !!$window.localStorage.getItem('com.ekgtracker');
  };

  var signout = function () {
    $window.localStorage.removeItem('com.ekgtracker');
    $state.transitionTo('signin');
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };

});