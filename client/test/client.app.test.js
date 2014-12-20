describe('AttachTokensFactory', function() {
  // Mocking Local Storage **FOR FUTURE USE YOU BRAVE SOUL**
  var mockStorage = {
    setItem: function() {},
    removeItem: function() {},
    key: function() {},
    getItem: function(string) {
      return this[string];
    },
    length: 0
  };
  var AttachTokensFactory;

  beforeEach(module('ekg'));
  beforeEach(inject(function(_AttachTokens_) {
    AttachTokensFactory = _AttachTokens_;
  }));

  it('should return an object with a request method', function() {
    expect(AttachTokensFactory).to.include.keys('request');
  });

});