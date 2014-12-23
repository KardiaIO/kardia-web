/**
 * TimeShift Factory
 */

describe('Unit: TimeFactory', function() {
  var TimeFactory;

  beforeEach(module('ekg.analysis'));
  beforeEach(inject(function($injector) {
    TimeFactory = $injector.get('TimeFactory');
  }));

  it('should set a time object', function() {
    TimeFactory.setTime(Date.now());
    // Sets up a time object with formatting.
    var dateObject = new Date(Date.now());
    var clockTime = {
      date: dateObject.getDate(),
      day: dateObject.getDay(),
      hour: dateObject.getHours(),
      minute: dateObject.getMinutes()
    };
    // getTime returns an object with clockTime and dateObject.
    var time = TimeFactory.getTime();
    expect(time).to.contain.keys('clockTime', 'dateObject');
    expect(JSON.stringify(time.clockTime)).to.equal(JSON.stringify(clockTime));
  });

});