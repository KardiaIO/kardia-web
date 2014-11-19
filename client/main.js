angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, DataGetter, Auth, TimeFactory) {

  $scope.getData = function(date, hour, minute) {

    DataGetter.getData(date, hour, minute)
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
  $scope.getData(TimeFactory.date, TimeFactory.hour, TimeFactory.minute);

  $scope.signout = Auth.signout;
  
})

  // Retrieves ekg data from node server
.factory('DataGetter', function ($http) {

  return {
    getData: function(date, hour, minute) {
      return $http.post('/users/data', {
        time: {
          date: date,
          hour: hour,
          minute: minute
        }  
      });
    }
  };

});
