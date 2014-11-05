'use strict';

angular.module('ekg', [
  'ekg.auth'
])

.config(function($stateProvider, $urlRouterProvider){

  // AngularUI Router uses the concept of states
  // Documentation: https://github.com/angular-ui/ui-router
  $stateProvider

    .state('home', {
      url: '/home',
      abstract: true,
      templateUrl: '/home.html'
    })

    .state('signin', {
      url: '/signin',
      abstract: true,
      templateUrl: '/auth/signin.html'
    })

    .state('signup', {
      url: '/signup',
      abstract: true,
      template: '/auth/signup.html'
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