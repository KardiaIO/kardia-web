angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, $interval, $timeout, DataGetter, Auth, TimeFactory) {

  $scope.dataArray = {
    results: [],
    indicators: []
  };
  $scope.renderer = 'line';

  var graphInterval;
  var serverInterval;
  var longGraphStartIndex = 0;
  var longGraphLength = 2500;
  var shortGraphStartIndex = 750;
  var shortGraphLength = 250;
  var time = 1420000000000;

  function grabDataInterval(){
    $scope.getData(time);
    time += 30000;
  };

  function changeGraphInterval(forward){
    $scope.largerSnippet = {
      results: $scope.dataArray.results.slice(longGraphStartIndex, longGraphStartIndex + longGraphLength),
      indicators: $scope.dataArray.indicators.slice(longGraphStartIndex, longGraphStartIndex + longGraphLength)
    };
    $scope.snippet = {
      results: $scope.largerSnippet.results.slice(shortGraphStartIndex, shortGraphStartIndex + shortGraphLength),
      indicators: $scope.largerSnippet.indicators.slice(shortGraphStartIndex, shortGraphStartIndex + shortGraphLength)
    };
    if (forward) longGraphStartIndex += 100;
    if (!forward && longGraphStartIndex - 100 >= 0) longGraphStartIndex -= 100;
    if (!forward && longGraphStartIndex - 100 < 0) $interval.cancel(graphInterval);
  };

  $scope.fastForward = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
    graphInterval = $interval(function(){
      changeGraphInterval(true);
    }, 10);
    serverInterval = $interval(function(){
      grabDataInterval(true);
    }, 1500);
  };

  $scope.playForward = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
    graphInterval = $interval(function(){
      changeGraphInterval(true);
    }, 100);
    serverInterval = $interval(function(){
      grabDataInterval(true);
    }, 3000);
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
  }

  $scope.getData = function(time, callback) {
    DataGetter.getData(time)
      .success(function(result){
        $scope.dataArray = {
          results: $scope.dataArray.results.concat(result.results),
          indicators: $scope.dataArray.indicators.concat(result.indicators)
        };
        if (callback) {
          callback(result);
        }
      })
      .catch(function(error){
        console.log('http get error', error);
      });
  };

  // Initialized data with current time
  $scope.getData(1420000000000, function(){
    changeGraphInterval(true);
  });

  // Signout function
  $scope.signout = Auth.signout;

})
// Retrieves ekg data from node server
.factory('DataGetter', function ($http) {
  return {
    getData: function(time) {
      console.log('Get Data at time = ', time);
      return $http.post('/users/data', {
        time: time
      });
    }
  };
});
