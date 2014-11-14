angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, DataGetter, Auth) {

  $scope.getData = function(dayOfWeek, hour, min) {
    DataGetter.getData(dayOfWeek, hour, min)
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

  $scope.getData(1, 0, 0);

  $scope.signout = Auth.signout;
  
})

  // Retrieves ekg data from node server
.factory('DataGetter', function ($http) {

  return {
    getData: function(dayOfWeek, hour, min) {
      return $http.post('/users/data', {
        time: {
          dayOfWeek: dayOfWeek,
          hour: hour,
          min: min
        }  
      });
    }
  };

});
