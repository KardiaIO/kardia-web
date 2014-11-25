;(function(){
  "use strict";

  angular.module('ekg.home')
  .controller('TimeController', function ($scope, TimeFactory) {

    $scope.display = '';
    TimeFactory.setTime(1420000000000, $scope);

  })

  .factory('TimeFactory', function(){
    
    var dateObject;
    var clockTime;
    var displayOptions = {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric'
    };

    return {
      setTime: function(UTC, context) {
        dateObject = new Date(UTC);
        clockTime = {
          date: dateObject.getDate(),
          day: dateObject.getDay(),
          hour: dateObject.getHours(),
          minute: dateObject.getMinutes()
        };
        if (context) context.display = dateObject.toLocaleDateString('en-US', displayOptions);
      },
      getTime: function() {
        return {
          clockTime: clockTime,
          dateObject: dateObject
        };
      }
    };

  });

  /*
  .controller('TimeController', function($scope, TimeFactory){
    // Attach Factory to scope, so it's accessible from html
    $scope.time = TimeFactory;
    // Display variable is updated on button clicks
    $scope.display = moment().format("dddd, MMMM Do YYYY, h:mm a");
    // The currentDay variable keeps a reference to the actual current day
    var currentDay = TimeFactory.getTime('value');
    // Temp variable for adding and subtracting time; $scope.display uses this variable
    var displayedTime = TimeFactory.getTime('value');

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
        // Default is activated when a user clicks a day of the week button
        default:
          // When the current day button is clicked
          if (currentDay.day() === degree) {
            // Set the displayedClock to the correct day of month
            displayedTime = moment(displayedTime).set('date', currentDay.date());
          } else {
            // Moment object of current time of day
            var newDate = currentDay;
            // If today is Monday and you click Tuesday, the while loop allows
            // you to find the first Tuesday that happened before today (Monday)
            while (newDate.day() !== degree) {
              newDate = moment(newDate).subtract(1, 'day');
            }
            displayedTime = moment(newDate);
          }
      } // End switch

      // Update factory to reflect what the clock shows
      TimeFactory.setTime('hour', displayedTime.hour());
      TimeFactory.setTime('minute', displayedTime.minutes());
      TimeFactory.setTime('dayOfWeek', displayedTime.day());
      TimeFactory.setTime('date', displayedTime.date());

      // Update time displayed on app
      $scope.display = moment(displayedTime).format("dddd, MMMM Do YYYY, h:mm a");
    };
  })

  .factory('TimeFactory', function() {
    // Moment object of current time for initial load
    var value = moment();
    console.log(value);
    
    var clockTime = {
      value: value,
      date: value.date(),
      dayOfWeek: value.day(),
      hour: value.hour(),
      minute: value.minutes()
    };

    return {
      getTime: function(timeInterval){
        return clockTime[timeInterval];
      },
      setTime: function(time){
        clockTime[timeInterval] = value;
      }
    };
  });
*/
})();
