angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, $interval, $timeout, DataGetter, Auth, TimeFactory) {

  // $scope.dataArray stores the data from the server on the client
  // There are two datasets, one containing all the raw EKG voltage
  // and the other containing the indicators of where 
  $scope.dataArray = {
    results: [],
    indicators: []
  };
  $scope.renderer = 'line';
  $scope.loading = true;

  var oboeObject;
  var graphInterval;
  var serverInterval;
  var longGraphStartIndex = 0;
  var longGraphLength = 750;
  var shortGraphStartIndex = 350;
  var shortGraphLength = 50;
  var time = 1420000000000;

  function grabDataInterval(){
    $scope.getData(time);
    time += 200000;
  }

  function changeGraphInterval(forward){
    $scope.largerSnippet = {
      results: $scope.dataArray.results.slice(longGraphStartIndex, longGraphStartIndex + longGraphLength),
      indicators: $scope.dataArray.indicators.slice(longGraphStartIndex, longGraphStartIndex + longGraphLength)
    };
    $scope.snippet = {
      results: $scope.largerSnippet.results.slice(shortGraphStartIndex, shortGraphStartIndex + shortGraphLength),
      indicators: $scope.largerSnippet.indicators.slice(shortGraphStartIndex, shortGraphStartIndex + shortGraphLength)
    };
    if (forward) longGraphStartIndex += 25;
    if (!forward && longGraphStartIndex - 25 >= 0) longGraphStartIndex -= 25;
    if (!forward && longGraphStartIndex - 25 < 0) $interval.cancel(graphInterval);
    TimeFactory.setTime($scope.largerSnippet.results[0].x, angular.element(document.querySelector('.timeButtons')).scope());
  }

  $scope.fastForward = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
    graphInterval = $interval(function(){
      changeGraphInterval(true);
    }, 10);
    serverInterval = $interval(function(){
      grabDataInterval(true);
    }, 3000);
  };

  $scope.playForward = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
    graphInterval = $interval(function(){
      changeGraphInterval(true);
    }, 100);
    serverInterval = $interval(function(){
      grabDataInterval(true);
    }, 5000);
  };

  $scope.playBackward = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
    graphInterval = $interval(function(){
      changeGraphInterval(false);
    }, 100);
  };

  $scope.fastBackward = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
    graphInterval = $interval(function(){
      changeGraphInterval(false);
    }, 10);
  };

  $scope.stopPlay = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
  };

  $scope.getData = function(time, callback) {
    DataGetter.getData(time)
      // Oboe allows us to have access to each object inside the JSON object
      // We grab any object with an x, y, and indicator property and add each data point
      // to the data array
      .node('{x y indicator}', function(heartbeat){
        $scope.loading = false;
        $scope.dataArray.results.push({x: heartbeat.x, y: heartbeat.y});
        $scope.dataArray.indicators.push({x: heartbeat.x, y: heartbeat.indicator});
      })
      .done(function(){
        // Initial load only passes a callback
        if (callback) {
          callback();
        }
      })
      .fail(function(error){
        console.log('http get error', error);
      });
  };

  // Initialized data with current time
  $scope.getData(1420000000000, function(){
    changeGraphInterval(true);
    // Oboe is outside of Angular context, so we manually $digest
    $scope.$digest();
  });

  // Signout function
  $scope.signout = Auth.signout;

  // Toggle appearance of R peak labeling data
  $scope.toggleR = function() {
    var indicatorLines = jQuery('path[stroke="blue"]');
    for (var i = 0; i < indicatorLines.length; i++){
      if (indicatorLines[i].className.baseVal.indexOf('hidden') === -1) {
        indicatorLines[i].className.baseVal += ' hidden';
      } else {
        indicatorLines[i].className.baseVal = 'path';
      }
    }
  };

})
// Retrieves ekg data from node server
.factory('DataGetter', function ($http) {
  var jwt = window.localStorage.getItem('com.ekgtracker');
  
  return {
    getData: function(time) {
      return oboe({
        url: '/users/data',
        method: 'POST',
        headers: {
          'x-access-token': jwt,
          'Allow-Control-Allow-Origin': '*'
        },
        body: {
          time: time
        },
        withCredentials: true
      });
    }
  };
});
