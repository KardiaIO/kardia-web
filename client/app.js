;(function(){
  'use strict';

  angular.module('ekg', [
    'ekg.auth',
    'ekg.home',
    'ui.router',
    'ngMaterial'
  ])

  .run(function($rootScope, $state, Auth){

    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
      if (toState.authenticate && !Auth.isAuth()){
        // User isn’t authenticated but the state requires authentication
        $state.transitionTo('welcome');
        event.preventDefault(); 
      }
    });

  })

  .config(function($stateProvider, $urlRouterProvider, $httpProvider){

    // AngularUI Router uses the concept of states
    // Documentation: https://github.com/angular-ui/ui-router
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: 'components/analysis/home.html',
        controller: 'MainController',
        authenticate: true
      })

      .state('triage', {
        url: '/triage',
        templateUrl: 'components/triage/mdTriage.html',
        authenticate: true    
      })

      .state('welcome', {
        url: '/welcome',
        templateUrl: 'components/signin/welcome.html'      
      });

    // The default route should point to the home page
    // which contains the graphs
    $urlRouterProvider.otherwise('/home');

    //We add $httpInterceptor into the array
    $httpProvider.interceptors.push('AttachTokens');

  })

  .factory('AttachTokens', function ($window) {
    // This is an $httpInterceptor. Its job is to stop all out going requests
    // then look in local storage and find the user's token.
    // Then, add it to the header so the server can validate the request
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
})();
