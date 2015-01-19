angular.module('ekg.analysis', [
  'ekg.auth',
  'btford.socket-io'
])
.directive('rickshaw', function(){
  return {
    scope: {
      data: '=',
      renderer: '=',
      width: '='
    },
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      scope.$watchCollection('[data, renderer, width]', function(newVal, oldVal) {
        if(!newVal[0]) {
          return;
        }

        element[0].innerHTML = '';

        var graph = new Rickshaw.Graph({
          element: element[0],
          width: scope.width,
          height: attrs.height,
          series: [{data: scope.data, color: attrs.color}],
          renderer: scope.renderer,
          min: 2.8,
          max: 7.2
        });

        graph.render();
      });
    }
  };
})
.controller('AnalysisController', function ($scope, $state, $window, socket) {
  var count = 0;
  var $statusCodeIcon = $('.status-code-icon');
  var $bpmIcon = $('.bpm-icon');
  $scope.incoming = [];
  $scope.renderer = 'line';
  // Graph width is set to viewport width
  $scope.width = $window.innerWidth;
  // Initial display views
  $scope.status = 'NA';
  $scope.bpm = '00';
  $scope.statusTitle = '--';
  $scope.bpmTitle = '--';
  $scope.isLive = 'Awaiting Heartbeat';
  
  /**
   * Socket Events
   */
  
  socket.on('connect', function () {
    console.log('new connection in client!');
  });

  // Incoming Objects from Node via Python
  socket.on('node.js', function (statusCode) {
    var status;
    if (statusCode.statusCode === "200") {
      status = "NSR";
      $scope.statusTitle = "Normal Sinus Rhythm";
    } else if (statusCode.statusCode === "404") {
      status = "ARR";
      $scope.statusTitle = "Arrhythmia";
    }

    $scope.status = status;
    $scope.bpmTitle = 'BPM';
    $scope.bpm = statusCode.heartRate;

    // Animate Icons
    $statusCodeIcon.addClass('faa-spin');
    $bpmIcon.addClass('faa-pulse');
  });

  // Incoming Objects from Node via Swift.
  socket.on('/analysisChart', function (data) {
    $scope.isLive = 'Streaming Heartbeat';
    // Convert time and amplitude to numbers for x, y coords
    var BLEData = JSON.parse(data.data);
    var amplitude = BLEData.amplitude;
    var displayData = {};
    displayData.x = count;
    count += 0.3;
    displayData.y = parseFloat(amplitude);

    // Make 25 points at any given time
    if ($scope.incoming.length > 25) {
      $scope.incoming.shift();
    }
    
    $scope.incoming = $scope.incoming.concat(displayData);
    $scope.$apply();
  });

  // When swift app is terminated or BLE data not connected
  socket.on('disconnected', function() {
    $scope.status = 'NA';
    $scope.bpm = '00';
    $scope.statusTitle = '--';
    $scope.bpmTitle = '--';
    $scope.isLive = 'Awaiting Heartbeat';

    // Remove animation classes
    $statusCodeIcon.removeClass('faa-spin');
    $bpmIcon.removeClass('faa-pulse');
    $scope.$apply();
  });

})
.factory('socket', function(socketFactory) {
  return socketFactory({
    ioSocket: io.connect('http://kardia.io')
  });
});
