angular.module('ekg.api', [])

.controller('APIController', function ($scope, $window, $state, $http, Auth) {
  // boolean and function used for determining the view displayed for signin/up
  $scope.isSigningIn = true;
  $scope.signinFormError = false;
  $scope.signupFormError = false;

  $scope.signingIn = function() {
    return !$scope.isAuth() && $scope.isSigningIn;
  };

  $scope.signingUp = function() {
    return !$scope.isAuth() && !$scope.isSigningIn;
  };

  $scope.switchView = function() {
    $scope.isSigningIn = !$scope.isSigningIn;
  };

  $scope.generateKey = function() {
  	//return generated API key and store it to user's mongodb obj
  	//if already have an API key, hide button and show "Show API key" button instead
  	$scope.generated = true;

  	return $http({
      method: 'GET',
      url: '/api/keys',
    }) 
    .then(function (res) {
      console.log("Here is your API key and Secure ID!");
      console.log("Keep it safe!");
      $scope.APIkey = res.data.id;
      $scope.SecureID = res.data.secret;
    });
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
        } else {
          // alert('Username or password was incorrect. Please try again.');
          $scope.signinFormError = true;
        }
      })
      .catch(function (error) {
        $scope.signinFormError = true;
        // alert('Error in signin function: ', error);
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
          // alert('Your email is already registered.');
        }
      })
      .catch(function (error) {
        $scope.signupFormError = true;
        // alert('Error in signup function: ', error);
      });
  };

  $scope.isAuth = Auth.isAuth;

  $scope.signout = function() {
  	Auth.signout();
  	$state.transitionTo('documents');
  };

})

.directive("compareTo", function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue === scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
});