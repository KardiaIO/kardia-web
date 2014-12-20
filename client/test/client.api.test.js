describe('APIController', function () {
  var $httpBackend, $rootScope, createController, generateKey, APIController, $state;
  // set up the module 
  beforeEach(module('ekg.api'));

  beforeEach(inject(function($injector){
    console.log('EHLLLOW????!@??!@!@?');
    $httpBackend = $injector.get('$httpBackend');
    generateKey = $httpBackend.when('GET', '/api/keys')
                            .respond({id: 'API Key'},{secret: 'SecureID'});
    // get hold of a scope and state
    var $rootScope = $injector.get('$rootScope');
    var $state = $injector.get('$state');
    var $window = $injector.get('$window');
    var Auth = $injector.get('Auth');
    // the controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    console.log('ALL STUFF: ', {
        '$scope': $rootScope, 
        '$window': $window,
        '$state': $state,
        '$http': $httpBackend, 
        'Auth': Auth
      })


    createController = function () {
      return $controller('APIController', {
        '$scope': $rootScope, 
        '$window': $window,
        '$state': $state,
        '$http': $httpBackend, 
        'Auth': Auth
      });
    };
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Should generate API key', function () {
    var controller = createController();
    $httpBackend.flush();
    $httpBackend.expectGET('/api/keys');
    expect($rootScope.APIkey).toBe('API Key');
    expect($rootScope.SecureID).toBe('SecureID');
    $httpBackend.flush();
  });

});