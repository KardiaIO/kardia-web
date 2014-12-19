angular.module('ekg.choose', [])

.controller('ChooseController', function ($scope, $location) {
  $scope.clickUser = function(){
  	$location.path('/home');
  }
})