;(function(){
  "use strict";

  angular.module('ekg.home')
  // The TimeController controls the time that is displayed on the "analysis" view. 
  .controller('TimeController', function ($scope, TimeFactory) {

    // $scope.display contains the date string that should be shown on the page.
    $scope.display = '';

    // When this controller is called, we initialize the time to 1420000000000 if
    // it is not already initialized.
    if (!TimeFactory.getTime().dateObject) TimeFactory.setTime(1420000000000, $scope);

  })

  // The TimeFactory is the source of truth of the timestamp of the data being displayed
  // on the long graph. The time stored here is the timestamp of the very first data point 
  // on the graph. 
  .factory('TimeFactory', function(){
    
    // When factory is first loaded, we will declare the dateObject and the clockTime
    // but will not define them. Note that the clockTime is not currently used in the code
    // but can be used to quickly look at the time in the dev environment. 
    var dateObject;
    var clockTime;

    // The displayOptions dictates the format of the time display. 
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
      // The setTime function will reset the clock to a new time as well as change the display.
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
      // GetTime will return the dateObject that is stored in the factory. 
      getTime: function() {
        return {
          clockTime: clockTime,
          dateObject: dateObject
        };
      }
    };

  });

})();
