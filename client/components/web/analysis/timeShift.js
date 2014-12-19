;(function(){
  "use strict";

  angular.module('ekg.analysis')
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

    // Old display for date and time, format: Tuesday, December 30, 2014, 8:35:32 pm
    // var displayOptions = {
    //   weekday: 'long', 
    //   year: 'numeric', 
    //   month: 'long', 
    //   day: 'numeric', 
    //   hour: 'numeric', 
    //   minute: 'numeric', 
    //   second: 'numeric'
    // };

    var displayOptions = {
      year: '2-digit', 
      month: '2-digit', 
      day: '2-digit'
    };

      /* NEW CLOCK CODE */
      Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
      return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
      }

      function rotate(element, degrees) {
        element.css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                     '-moz-transform' : 'rotate('+ degrees +'deg)',
                     '-ms-transform' : 'rotate('+ degrees +'deg)',
                     'transform' : 'rotate('+ degrees +'deg)'});
      }

      function setClockTime(UTC) {
        var date = new Date(UTC);
        var sec = date.getSeconds();
        var min = date.getMinutes();
        var hrs = date.getHours();

        var mapSec = sec.map(0, 59, 0, 360);
        var mapMin = min.map(0,59,0,360);
        var mapHrs = hrs.map(0,12,0,360);

        if (sec == 0) {
          $('.seconds-hand').removeClass('smooth');
        } else {
          $('.seconds-hand').addClass('smooth');
        }

        if (min == 0) {
          $('.minute-hand').removeClass('smooth');
        } else {
          $('.minute-hand').addClass('smooth');
        }

        if (hrs == 0) {
          $('.hour-hand').removeClass('smooth');
        } else {
          $('.hour-hand').addClass('smooth');
        }

        rotate($('.seconds-hand'), mapSec);
        rotate($('.minute-hand'), mapMin);
        rotate($('.hour-hand'), mapHrs);
      }

      /* END NEW CLOCK CODE */


    return {
      // The setTime function will reset the clock to a new time as well as change the display.
      setTime: function(UTC, context) {
        /* NEW CLOCK CODE */
        setClockTime(UTC);
        /* END NEW CLOCK CODE */
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
