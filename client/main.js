angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, $interval, DataGetter, Auth, TimeFactory) {

  $scope.time = TimeFactory;
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

  function grabDataInterval(forward){
    var time = (($scope.time.dayOfWeek * 24 + $scope.time.hour) * 60 + $scope.time.minute) * 60000;
    $scope.getData(time);
    if (forward) time += 30000;
    if (!forward && time - 30000 >= 0) time -= 30000;
    var totalTimeInMinutes = Math.floor(time / 60000);
    var minute = totalTimeInMinutes % 60;
    var hour = ((totalTimeInMinutes - minute) / 60) % 24;
    var dayOfWeek = Math.floor(totalTimeInMinutes / 60 / 24) % 7;
    $scope.time = {
      dayOfWeek: dayOfWeek,
      hour: hour,
      minute: minute
    };
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
    if (forward) longGraphStartIndex += 5;
    if (!forward && longGraphStartIndex - 5 >= 0) longGraphStartIndex -= 5;
  };

  function updateDisplayInterval(forward, interval){

  };

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
    }, 30);
    serverInterval = $interval(function(){
      grabDataInterval(true);
    }, 9000);
  };

  $scope.playBackward = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
    graphInterval = $interval(function(){
      changeGraphInterval(false);
    }, 30);
    serverInterval = $interval(function(){
      grabDataInterval(false);
    }, 9000);
  };

  $scope.fastBackward = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
    graphInterval = $interval(function(){
      changeGraphInterval(false);
    }, 10);
    serverInterval = $interval(function(){
      grabDataInterval(false);
    }, 3000);
  };

  $scope.stopPlay = function(){
    $interval.cancel(graphInterval);
    $interval.cancel(serverInterval);
  }

  $scope.getData = function(time) {
    DataGetter.getData(time)
      .success(function(result){
        $scope.dataArray = {
          results: $scope.dataArray.results.concat(result),
          indicators: $scope.dataArray.indicators.concat(result)
        };
      })
      .catch(function(error){
        console.log('http get error', error);
      });
  };

  // Initialized data with current time
  $scope.getData(0);
  grabDataInterval(true);
  changeGraphInterval(true);

  // Signout function
  $scope.signout = Auth.signout;
  /*
  jQuery('#longGraph')
    .mousedown(function(event){
      console.log('in mousedown call back');
      var startingX = event.clientX;
      jQuery(window).mousemove(function(event){
        var drag = event.clientX - startingX;
        if ($scope.longGraphStartX + drag/10 < 0) {
          $scope.longGraphStartX = 0;
        } else if ($scope.longGraphStartX + drag/10 + $scope.longGraphLength > $scope.data.length) {
          $scope.longGraphStartX = $scope.data.length - $scope.longGraphLength;
        } else {
          $scope.longGraphStartX = $scope.longGraphStartX + drag/10;
        }
        $scope.largerSnippet = {
          results:$scope.data.results.slice($scope.longGraphStartX, $scope.longGraphStartX + $scope.longGraphLength),
          indicators:$scope.data.indicators.slice($scope.longGraphStartX, $scope.longGraphStartX + $scope.longGraphLength)
        };
      })
    });
 */
})
  // Retrieves ekg data from node server
.factory('DataGetter', function ($http) {
  return {
    getData: function(time) {
      return $http.get('/sampleData/sample1.json');
      //return $http.post('/users/data', {
      //  time: time
      //});
    }
  };
});
