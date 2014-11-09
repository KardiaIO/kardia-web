angular.module('ekg.home', [
  'ekg.auth'
])

.controller('MainController', function ($scope, $http, Auth) {

  $http.get('/sampleData/sample1snippet.json')
    .success(function(result){
      $scope.sampleData1 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  $http.get('/sampleData/sample1.json')
    .success(function(result){
      $scope.sampleData2 = result;
      $scope.renderer = 'line';
    })
    .catch(function(error){
      console.log('http get error', error);
    });

  $scope.signout = Auth.signout;
  
});
