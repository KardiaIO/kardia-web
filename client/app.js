;(function(){
  'use strict';

  angular.module('ekg', [
    'ekg.auth',
    'ekg.analysis',
    'ekg.choose',
    'ekg.api',
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

  .config(function($stateProvider, $urlRouterProvider, $httpProvider){

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
        controller: 'MainController',
        authenticate: true
      })

      .state('user.triage', {
        url: '/triage',
        templateUrl: 'components/web/triage/mdTriage.html',
        authenticate: true    
      })

      .state('choose', {
        url: '/',
        templateUrl: 'choose/choose.html',
        controller: 'ChooseController'     
      })

      .state('developer', {
        url: '/developer',
        templateUrl: 'components/developer/developer.html',
        controller: 'DevController'     
      })

      .state('documents', {
        url: '/documents',
        templateUrl: 'components/developer/documents/documents.html',   
      })

      .state('apiKeys', {
        url: '/api',
        templateUrl: 'components/developer/api/api.html',
        controller: 'APIController'     
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
