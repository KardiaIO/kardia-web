angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, DataGetter, Auth, TimeFactory) {

  $scope.getData = function(dayOfWeek, hour, minute) {

    DataGetter.getData(dayOfWeek, hour, minute)
      .success(function(result){
        $scope.largerSnippet = result;
        $scope.getSnippet(0); 
        $scope.renderer = 'line';
      })
      .catch(function(error){
        console.log('http get error', error);
      });
  };

  $scope.getSnippet = function(startIndex){
    $scope.snippet = {
      results: $scope.largerSnippet.results.slice(startIndex, startIndex + 250),
      indicators: $scope.largerSnippet.indicators.slice(startIndex, startIndex + 250)
    };
  };

  // Initialized data with current time
  $scope.getData(TimeFactory.dayOfWeek, TimeFactory.hour, TimeFactory.minute);

  $scope.signout = Auth.signout;
  
})

  // Retrieves ekg data from node server
.factory('DataGetter', function ($http) {

  return {
    getData: function(dayOfWeek, hour, minute) {
      return $http.post('/users/data', {
        time: {
          dayOfWeek: dayOfWeek,
          hour: hour,
          minute: minute
        }  
      });
    }
  };

});
