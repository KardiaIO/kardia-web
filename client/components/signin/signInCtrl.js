// controls ngMorph component. Not hooked up yet.

angular.module('ekg')  
  .controller('SignInCtrl', ['$scope', function ($scope) {
    $scope.example1 = {
      closeEl: '.close',
      modal: {
        templateUrl: 'loginform.html'
      }
    };


  }])
