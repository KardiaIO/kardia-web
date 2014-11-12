angular.module('ekg')
  .controller('timeCtrl', function($scope, timeFactory){
    $scope.time = timeFactory;

    $scope.time.display = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

    $scope.increment = function() {
      $scope.time.value = moment($scope.time.value).add(1000, 'seconds'); 
      $scope.time.display = moment($scope.time.value).format("dddd, MMMM Do YYYY, h:mm:ss a");
    };

    $scope.iincrement = function() {
      $scope.time.value = moment($scope.time.value).add(10000, 'seconds'); 
      $scope.time.display = moment($scope.time.value).format("dddd, MMMM Do YYYY, h:mm:ss a");
    };
    
    $scope.decrement = function() {
      $scope.time.value = moment($scope.time.value).subtract(1000, 'seconds'); 
      $scope.time.display = moment($scope.time.value).format("dddd, MMMM Do YYYY, h:mm:ss a");
    };

    $scope.ddecrement = function() {
      $scope.time.value = moment($scope.time.value).subtract(10000, 'seconds'); 
      $scope.time.display = moment($scope.time.value).format("dddd, MMMM Do YYYY, h:mm:ss a");
    };

  })

  .factory('timeFactory', function() {
    var value = moment(new Date());
    return {
      value: value
    };
  });

