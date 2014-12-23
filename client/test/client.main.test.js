/**
 * DataGetter Factory
 */

describe('Unit: DataGetterFactory', function() {
  var DataGetter, server, store = {};

  beforeEach(module('ekg.analysis'));
  beforeEach(inject(function($injector) {
    DataGetter = $injector.get('DataGetter');
    // Stub localStorage Methods.
    sandbox = sinon.sandbox.create();
    sandbox.stub(window.localStorage, 'setItem', function(key, value) {
      store[key] = value;
    });
    sandbox.stub(window.localStorage, 'getItem', function(key) {
      return store[key];
    });

    server = sinon.fakeServer.create();
    server.respondWith('POST', '/users/data', [
      200, {'Content-Type': 'application/json'}, '[{"x":"5", "y":"6.705", "indicator":"heartbeat"}]']);
  }));

  afterEach(function() {
    server.restore();
    sandbox.restore();
    store = {};
  });

  it('should respond with coordinates and indicator', function() {
    var response;
    // getData expects a jwt in localStorage.
    window.localStorage.setItem('com.ekgtracker', 'space-oddity');

    DataGetter.getData(Date.now())
      .node('{x y indicator}', function(heartbeat){
        response = heartbeat;
      })
      .done();
    // Fake server response.  
    server.respond();
    expect(response).to.be.an('object');
    expect(JSON.stringify(response)).to.equal('{"x":"5","y":"6.705","indicator":"heartbeat"}');
  });
});