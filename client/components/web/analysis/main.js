angular.module('ekg.analysis', [
  'ekg.auth'
])
.directive('rickshaw', function($window){
  return {
    scope: {
      data: '=',
      renderer: '=',
      width: '='
    },
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      // $window.onresize = function() {
      //   scope.$apply();
      // };

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

        // var yAxis = new Rickshaw.Graph.Axis.Y({graph:graph});
        // yAxis.render();

        graph.render();
      });
    }
  };
})
.controller('AnalysisController', function ($scope, $state, $window) {
  // Incoming Objects from Node via Swift.
  var socket = io.connect("http://localhost:8080");
  var count = 0;  
  $scope.incoming = [];
  $scope.renderer = 'line';
  $scope.width = $window.innerWidth;
  $scope.status = 'NA';
  $scope.bpm = '00';
  $scope.statusTitle = '';
  $scope.bpmTitle = 'BPM';
  $scope.isLive = 'Awaiting Heartbeat';
  
  socket.on('connect', function () {
    console.log('new connection in client!');
  });

  socket.on('node.js', function (code) {
    var status;
    if (code.statusCode === "200") {
      status = "NSR";
      $scope.statusTitle = "Normal Sinus Rhythm";
    } else if (code.statusCode === "404") {
      status = "ARR";
      $scope.statusTitle = "Arrhythmia";
    }
    $scope.status = status;
    $scope.bpm = code.heartRate;
  });

  socket.on('/analysisChart', function (data) {
    $scope.isLive = 'Streaming Heartbeat';
    // Convert time and amplitude to numbers for x, y coords
    var dataObject = data.data;
    var parsedObject = JSON.parse(dataObject);
    var amplitude = parsedObject.amplitude;
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

});
