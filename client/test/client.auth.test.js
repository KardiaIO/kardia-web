/**
 * Auth Factory
 */

describe('Unit AuthFactory', function() {
  var Auth, $httpBackend, store = {};

  // Get Module
  beforeEach(module('ekg.auth'));
  beforeEach(inject(function($injector) {
    // Inject AuthFactory into local variable Auth.
    Auth = $injector.get('Auth');
    // Sets the mock http service responses.
    $httpBackend = $injector.get('$httpBackend');
    // Mocks localStorage Methods.
    sandbox = sinon.sandbox.create();
    sandbox.stub(window.localStorage, 'setItem', function(key, value) {
      store[key] = value;
    });
    sandbox.stub(window.localStorage, 'getItem', function(key) {
      return store[key];
    });
    sandbox.stub(window.localStorage, 'removeItem', function(key) {
      delete store[key];
    });
  }));

  // Verifies that all requests if made and checks if any needs to be flushed.
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();

    sandbox.restore();
    store = {};
   });
  
  it('should respond with a token when signing in', function() {
    var user = { username: 'david', password: 'bowie' };
    var token;
    // Fake our server logic.  This posts our user and responds with a token object.
    $httpBackend.whenPOST('/users/signin').respond(function(method, url, data) {
      var json = JSON.parse(data); 
      json.password = json.password + '-jwt-tokenized';
      token = { token: json.password };
      return [201, url, data];
    });
    // Calls AuthFactory SignIn Method with supplied user object.
    Auth.signin(user);

    $httpBackend.flush();
    expect(token).to.be.an('object');
    expect(token.token).to.equal('bowie-jwt-tokenized');
  });
  
  it('should return true if user is Authorized in localStorage', function() {
    // Set token in localStorage.
    window.localStorage.setItem('com.ekgtracker', 'some-long-string');
    expect(Auth.isAuth()).to.equal(true);
  });
  
  it('should return false if string key is not com.ekgtracker', function() {
    window.localStorage.setItem('com.falsey', 'some-long-string');
    expect(Auth.isAuth()).to.equal(false);
  });

  it('should remove token from localStorage', function() {
    window.localStorage.setItem('com.ekgtracker', 'life-on-mars');
    expect(store).to.contain.keys('com.ekgtracker');
    // Remove key form store
    Auth.signout();
    expect(store).to.eql({});
  });
});

/**
 * Auth Controller
 */

describe('Unit: AuthController', function() {

  var $rootScope, 
      $state, 
      $controller, 
      $q, 
      createController, 
      Auth, 
      store = {},
      defer;
  
  beforeEach(function() {
    module('ekg.auth');
    module('ui.router');
    // Mocks $state to fake transitionTo(string).
    module('stateMock');
  });
 
  beforeEach(inject(function($injector) {
    Auth = $injector.get('Auth');
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
    $window = $injector.get('$window');
    $q = $injector.get('$q');
    $controller = $injector.get('$controller');
    
    // Stub localStorage.
    sandbox = sinon.sandbox.create();
    sandbox.stub(window.localStorage, 'setItem', function(key, value) {
      store[key] = value;
    });
    // Stub Auth Factory
    AuthStub = {
      signin: sandbox.stub(Auth, 'signin')
    };

    createController = $controller('AuthController', {
      $scope: $rootScope,
      $state: $state,
      $window: $window,
      Auth: AuthStub
    });
  }));

  afterEach(function() {
    sandbox.restore();
    store = {};
   });


  it('should sign a user in and redirect to user.triage', function() {
    $rootScope.user = { username: 'freddy', password: 'mercury' };
    // Sets up a promise and returns a token from our signin stub. 
    defer = $q.defer();
    defer.resolve('diamond-dogs');
    AuthStub.signin.withArgs($rootScope.user).returns(defer.promise);
    // Mocks a transistion using stateMock.js.
    $state.expectTransitionTo('user.analysis');
    // Call Controller's signin method and run digest loop.
    $rootScope.signin();
    $rootScope.$apply();

    expect(store).to.contain.keys('com.ekgtracker');
    expect(store['com.ekgtracker']).to.equal('diamond-dogs');
  });

  it('should return signinFormError = true when user is empty', function() {
    defer = $q.defer();
    defer.resolve();
    AuthStub.signin.withArgs().returns(defer.promise);
    $rootScope.signin();
    $rootScope.$apply();

    expect($rootScope.signinFormError).to.equal(true);
  });
});












