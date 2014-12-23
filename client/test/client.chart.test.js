/**
 * Chart Factory
 */

describe('Unit: getResultsFactory', function() {
  var getResults, $httpBackend;

  beforeEach(module('ekg.analysis'));
  beforeEach(inject(function($injector) {
    getResults = $injector.get('getResults');
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
   });

  it('should return a timeStamp object when POSTing to /users/analysis', function() {
    var timeStamp, time = Date.now();
    // Gets data from POST and populates timeStamp for reference.
    $httpBackend.whenPOST('/users/analysis').respond(function(method, url, data) {
      timeStamp = JSON.parse(data);
      return [201, url, data];
    });
    // Call getChartData with a timeStamp.
    getResults.getChartData(time);
    $httpBackend.flush();
    
    expect(timeStamp).to.be.an('object');
    expect(timeStamp.time).to.equal(time);
  });

  it('should return a timeStamp object when POSTing to /users/lorenz', function() {
    var timeStamp, time = Date.now();

    $httpBackend.whenPOST('/users/lorenz').respond(function(method, url, data) {
      timeStamp = JSON.parse(data);
      return [201, url, data];
    });

    getResults.getLorenzData(time);
    $httpBackend.flush();
    
    expect(timeStamp).to.be.an('object');
    expect(timeStamp.time).to.equal(time);
  });
});










