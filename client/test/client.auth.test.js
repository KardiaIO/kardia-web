describe('Unit AuthFactory', function() {
  var Auth, $httpBackend, store = {};

  // Get Module
  beforeEach(module('ekg.auth'));
  // Inject AuthFactory into local variable Auth.
  beforeEach(inject(function(_Auth_, $injector) {
    Auth = _Auth_;
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
    expect(Auth.isAuth()).to.be.true;
  });
  
  it('should return false if string key is not com.ekgtracker', function() {
    // Set token in localStorage.
    window.localStorage.setItem('com.falsey', 'some-long-string');
    expect(Auth.isAuth()).to.be.false;
  });

  it('should remove token from localStorage', function() {
    window.localStorage.setItem('com.ekgtracker', 'life-on-mars');
    expect(store).to.contain.keys('com.ekgtracker');
    // Remove key form store
    Auth.signout();
    expect(store).to.be.empty;
  });
});

describe('Unit: AuthController', function() {
  var $httpBackend, $rootScope, $state, $controller, createController, Auth;
  // Load Controller Module
  beforeEach(module('ekg.auth'));
  beforeEach(inject(function($injector,_Auth_) {
    Auth = _Auth_;
    $httpBackend = $injector.get('$httpBackend');
    $state = $injector.get('$state');
    $controller = injector.get('$controller');

    createController = function() {
      return $controller('AuthController', {
        '$scope': $rootScope,
        '$state': $state,
        'Auth': Auth
      });
    };
    // Mock localStorage
    sandbox = sinon.sandbox.create();
    sandbox.stub(window.localStorage, 'setItem', function(key, value) {
      store[key] = value;
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();

    sandbox.restore();
    store = {};
   });

});












