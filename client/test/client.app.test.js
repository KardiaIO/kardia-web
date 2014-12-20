describe('AttachTokensFactory', function() {
  var AttachTokensFactory;
  var sandbox;
  var store = {};

  // Get Factory Module
  beforeEach(module('ekg'));
  // Injecting Factory into local variable & setting up LocalStorage stubs.
  beforeEach(inject(function(_AttachTokens_) {
    AttachTokensFactory = _AttachTokens_;
    sandbox = sinon.sandbox.create();

    sandbox.stub(window.localStorage, 'setItem', function(key, value) {
      store[key] = value;
    });
    sandbox.stub(window.localStorage, 'getItem', function(key) {
      return store[key];
    });
  }));

  afterEach(function() {
    sandbox.restore();
    store = {};
  });

  it('should return an object with a request method', function() {
    expect(AttachTokensFactory).to.include.keys('request');
  });

  it('should get key/jwt tokens from localStorage', function() {
    // Creates a fake header object to append fake jwt token to.
    var headerWrapper = {
      headers: {}
    };
    // Set token in localStorage so that our factory can retrieve it.
    window.localStorage.setItem('com.ekgtracker', 'some-long-string');
    // Returns the 'attach' object with headers appended.
    var response = AttachTokensFactory.request(headerWrapper);
    expect(response.headers['x-access-token']).to.equal('some-long-string');
    expect(response.headers['Allow-Control-Allow-Origin']).to.equal('*');
  });
});