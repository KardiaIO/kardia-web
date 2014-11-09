angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, DataGetter, Auth) {

  DataGetter.getData(true)
    .success(function(result){
      $scope.sampleData1 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  DataGetter.getData()
    .success(function(result){
      $scope.sampleData2 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  $scope.getData = function(dayOfWeek, hour, min) {
    DataGetter.getData(false, dayOfweek, hour, min)
      .success(function(result){
        $scope.sampleData1 = result;
        $scope.renderer = 'line';
      })
      .catch(function(error){
        console.log('http get error', error);
      });
  };

  $scope.signout = Auth.signout;
  
})

.factory('DataGetter', function ($http) {

  return {
    getData: function(large, dayOfWeek, hour, min) {
      if (large) {
        return $http.get('/sampleData/sample1snippet.json');
      } else {
        return $http.get('/sampleData/sample1.json');
      }
    }
  };

});
