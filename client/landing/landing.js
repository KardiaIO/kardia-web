angular.module('ekg.landing', [])

.controller('LandingController', function ($scope, $interval, $window) {
  // Sends user to developer page
  $scope.threeScale = function(){
    $window.location.href = "https://kardiaio.3scale.net/";
  };
})
