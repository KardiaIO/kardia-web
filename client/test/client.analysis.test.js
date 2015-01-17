/**
 * Analysis Controller
 */
describe('Unit: AnalysisController', function() {
  
  var $rootScope, 
      $state, 
      $window,
      $controller,
      $timeout,
      createController,
      mockIoSocket,
      socket,
      spy;

  beforeEach(module('ekg.analysis'));
  beforeEach(module('btford.socket-io'));

  beforeEach(inject(function($injector, socketFactory) {
    $rootScope = $injector.get('$rootScope');
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    $controller = $injector.get('$controller');
  
    spy = sinon.spy();
    // Creates mock socket.  'io' object is mocked from socketMock.js.  This is not socket.io.
    mockIoSocket = io.connect();
    socket = socketFactory({
      ioSocket: mockIoSocket,
      scope: $rootScope
    });

    createController = $controller('AnalysisController', {
      $scope: $rootScope,
      $state: $state,
      $window: $window,
      socket: socket
    });

  }));

  afterEach(function() {
    $rootScope.incoming = {};
  });

  /**
   * Socket.io Client Events
   */
  describe('on', function () {
    it('should apply asynchronously', function () {
      socket.on('event', spy);
      
      mockIoSocket.emit('event');
      expect(spy).to.have.not.been.called;
      $timeout.flush();

      expect(spy).to.have.been.called;
    });
  });

  describe('node.js event', function() {
    it('should convert statusCode to NSR or ARR', function() {
      mockIoSocket.emit('node.js', { 'statusCode': '200', 'heartRate': '60' });
      $timeout.flush();

      expect($rootScope.status).to.equal('NSR');
      expect($rootScope.bpm).to.equal('60');

      mockIoSocket.emit('node.js', { 'statusCode': '404', 'heartRate': '80' });
      $timeout.flush();

      expect($rootScope.status).to.equal('ARR');
    });
  });

  describe('analysisChart event', function() {
    it('should store coordinate values in incoming array from JSON object', function() {
      mockIoSocket.emit('/analysisChart', {"data": '{"amplitude": "5.09"}'});
      $timeout.flush();

      expect($rootScope.incoming[0]).to.deep.equal({ x: 0, y: 5.09});

      mockIoSocket.emit('/analysisChart', {"data": '{"amplitude": "8.04"}'});
      $timeout.flush();

      expect($rootScope.incoming[1]).to.deep.equal({ x: 0.3, y: 8.04});
    });
  });

});

/**
 * Analysis Rickshaw Directive
 */
describe('Unit: RickshawDirective', function() {
  var element, $rootScope, $sandbox;

  beforeEach(module('ekg.analysis'));

  beforeEach(inject(function($injector, $compile) {
    $rootScope = $injector.get('$rootScope');
    $rootScope.data = [{ x: 0.3, y: 5.09 }];
    $rootScope.width = 1200;
    $rootScope.renderer = 'line';

    // Throw an element in the DOM so we can attach our graph to it.
    $sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
    // We need to compile the element and call the digest loop to 'render' our directive.
    element = $compile($sandbox)($rootScope);
    $rootScope.$digest();
  }));

  afterEach(function() {
    $sandbox.remove();
  });

  describe('scope data', function() {
    beforeEach(function() {

      var graph = new Rickshaw.Graph({
        element: document.querySelector('#sandbox'),
        width: $rootScope.width,
        height: 500,
        series: [{data: $rootScope.data, color: 'blue'}],
        renderer: $rootScope.renderer,
        min: 2.8,
        max: 7.2
      });
      graph.render();

    });

    it('should append an svg to a div with the id of sandbox', function() {
      expect(element.find('svg')).to.exist;
      expect(element.find('div#sandbox')).to.exist;
    });
    
    it('should contain an svg tag with proper size', function() {
      expect(element.find('svg').attr('height')).to.equal('500');
      expect(element.find('svg').attr('width')).to.equal('1200');
    });
  });
});