;(function(){
  "use strict";

  angular.module('ekg')
    .controller('TimeController', function($scope, TimeFactory){
      // Attach Factory to scope, so it's accessible from html
      $scope.time = TimeFactory;
      $scope.display = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
      var displayedTime = TimeFactory.value;

      $scope.updateDisplayTime = function(degree) {
        switch(degree) {
          case '--':
            displayedTime = moment(displayedTime).subtract(30, 'minutes'); 
            break; 
          case '-': 
            displayedTime = moment(displayedTime).subtract(1, 'minute'); 
            break; 
          case '+': 
            displayedTime = moment(displayedTime).add(1, 'minute'); 
            break; 
          case '++': 
            displayedTime = moment(displayedTime).add(30, 'minutes'); 
            break;
        }
        // Update factory to reflect what the clock shows
        TimeFactory.hour = displayedTime.hour();
        TimeFactory.minute = displayedTime.minutes();
        TimeFactory.dayOfWeek = displayedTime.day();
        // Update time displayed on app
        $scope.display = moment(displayedTime).format("dddd, MMMM Do YYYY, h:mm:ss a");
      };
    })

    .factory('TimeFactory', function() {
      // Moment object of current time for initial load
      var value = moment();

      return {
        value: value,
        dayOfWeek: value.day(),
        hour: value.hour(),
        minute: value.minutes()
      };
    });
})();

