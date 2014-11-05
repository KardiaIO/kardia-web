'use strict';

angular.module('ekg', [
  'ekg.auth',
  'ui.router'
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider){

  // AngularUI Router uses the concept of states
  // Documentation: https://github.com/angular-ui/ui-router
  $stateProvider

    .state('home', {
      url: '/home',
      templateUrl: '/home.html'
    })

    .state('signin', {
      url: '/signin',
      templateUrl: '/auth/signin.html',
      controller: 'AuthController'
    })

    .state('signup', {
      url: '/signup',
      templateUrl: '/auth/signup.html',
      controller: 'AuthController'
    });

  // the default route should point to the home page
  // which contains the graphs
  $urlRouterProvider.otherwise('/home');

  //We add $httpInterceptor into the array
  $httpProvider.interceptors.push('AttachTokens');

})

.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor. its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.ekgtracker');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
});