angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, DataGetter, Auth) {

  $scope.getData = function(dayOfWeek, hour, min) {
    DataGetter.getData(dayOfweek, hour, min)
      .success(function(result){
        $scope.largerSnippet = result;
        $scope.renderer = 'line';
      })
      .catch(function(error){
        console.log('http get error', error);
      });
  };

  $scope.getSnippet = function(startIndex){
    $scope.snippet = $scope.largerSnippet.slice(startIndex, startIndex + 250);
  };

  $scope.getData(1, 0, 0);
  $scope.getSnippet(15*250/2-125);

  $scope.signout = Auth.signout;
  
})

.factory('DataGetter', function ($http) {

  return {
    getData: function(dayOfWeek, hour, min) {
      return $http({
        method: 'GET',
        url: '/users/data',
        data: {
          time: {
            dayOfWeek: dayOfWeek,
            hour: hour,
            min: min
          }
        }
      });
    }
  };

});
