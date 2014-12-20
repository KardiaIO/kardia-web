angular.module('ekg.auth', [])

.controller('AuthController', function ($scope, $window, $state, Auth, $location) {
  // booleans used to determine whether error message should be displayed.
  $scope.signinFormError = false;
  $scope.signupFormError = false;

  // boolean and function used for determining the view displayed for signin/up
  $scope.isSigningIn = true;

  $scope.signingIn = function() {
    return !$scope.isAuth() && $scope.isSigningIn;
  };

  $scope.signingUp = function() {
    return !$scope.isAuth() && !$scope.isSigningIn;
  };

  $scope.switchView = function() {
    $scope.isSigningIn = !$scope.isSigningIn;
  };

  $scope.user = {};

  $scope.signin = function () {
    $scope.signinFormError = false;
    Auth.signin($scope.user)
      .then(function (token) {
        // The server should return a json web token if the user is successfully authenticated.
        // We will put this token into local storage.
        if (token) {
          $window.localStorage.setItem('com.ekgtracker', token);
          $state.transitionTo('user.triage');
        } else {
          $scope.signinFormError = true;
        }
      })
      .catch(function (error) {
        $scope.signinFormError = true;
      });
  };

  $scope.signup = function () {
    $scope.signupFormError = false;
    Auth.signup($scope.user)
      .then(function (token) {
        if (token) {
          $window.localStorage.setItem('com.ekgtracker', token);
        } else {
          $scope.signupFormError = true;
        }
      })
      .catch(function (error) {
        $scope.signupFormError = true;
      });
  };

  $scope.isAuth = Auth.isAuth;

  $scope.signout = Auth.signout;

  $scope.isActive = function (viewLocation) { 
    return $state.is(viewLocation);
  };
})

// The Auth factory is responsible for sending the $http requests to the server
// with user information for authentication. It also checks for authentication 
// by looking at the local storage for existing tokens as well as signs the user
// out by deleting the token. 
.factory('Auth', function ($http, $window) {
 
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
  };

  return {
    signin: signin,
    signup: signup,
    isAuth: isAuth,
    signout: signout
  };

});
