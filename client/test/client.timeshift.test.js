describe('TimeFactory', function() {
  var TimeFactory;

  beforeEach(module('ekg.analysis'));
  beforeEach(inject(function(_TimeFactory_) {
    TimeFactory = _TimeFactory_;
  }));

  it('should be a function', function() {
    expect(TimeFactory.setTime).to.be.an('function');
  });

});