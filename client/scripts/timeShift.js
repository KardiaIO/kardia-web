angular.module('ekg')
  .controller('timeCtrl', function($scope, timeFactory){
    $scope.time = timeFactory;

    $scope.time.display = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

    $scope.increment = function() {
      $scope.time.value = moment($scope.time.value).add(60, 'seconds'); 
      $scope.time.display = moment($scope.time.value).format("dddd, MMMM Do YYYY, h:mm:ss a");
    };

    $scope.iincrement = function() {
      $scope.time.value = moment($scope.time.value).add(1800, 'seconds'); 
      $scope.time.display = moment($scope.time.value).format("dddd, MMMM Do YYYY, h:mm:ss a");
    };
    
    $scope.decrement = function() {
      $scope.time.value = moment($scope.time.value).subtract(60, 'seconds'); 
      $scope.time.display = moment($scope.time.value).format("dddd, MMMM Do YYYY, h:mm:ss a");
    };

    $scope.ddecrement = function() {
      $scope.time.value = moment($scope.time.value).subtract(1800, 'seconds'); 
      $scope.time.display = moment($scope.time.value).format("dddd, MMMM Do YYYY, h:mm:ss a");
    };

  })

  .factory('timeFactory', function() {
    var value = moment(new Date());
    return {
      value: value
    };
  });

