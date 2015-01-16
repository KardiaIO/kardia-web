;(function(){
  'use strict';

  angular.module('ekg', [
    'ekg.auth',
    'ekg.analysis',
    'ui.router',
    'ngMaterial'
  ])

  .run(function($rootScope, $state, Auth){

    // On each state change, Angular will check for authentication
    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
      // Check if the user is authenticated when the state requires authentication
      if (toState.authenticate && !Auth.isAuth()){
        $state.transitionTo('user');
        event.preventDefault(); 
      }
    });

  })


  .config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

    // AngularUI Router uses the concept of states
    // Documentation: https://github.com/angular-ui/ui-router
    $stateProvider

      .state('user', {
        url: '/user',
        templateUrl: 'components/signin/welcome.html',
        controller: 'AuthController'
      })

      .state('user.analysis', {
        url: '/analysis',
        templateUrl: 'components/web/analysis/analysis.html',
        controller: 'AnalysisController',
        authenticate: true
      })

      .state('user.triage', {
        url: '/triage',
        templateUrl: 'components/web/triage/mdTriage.html',
        controller: 'AuthController',
        authenticate: true
      })

      .state('landing', {
        url: '/',
        templateUrl: 'landing/landing.html'
      });

    // The default route should point to the root page
    // which contains the developer and user options
    $urlRouterProvider.otherwise('/');

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
