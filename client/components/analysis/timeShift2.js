
.controller('TimeController', function (TimeFactory) {

  $scope.display = '';
  var displayOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  TimeFactory.setTime(1420000000000, $scope, displayOptions);

})

.factory('TimeFactory', function(){
  
  var dateObject;
  var clockTime;

  return {
    setTime: function(UTC, context) {
      dateObject = new Date(UTC);
      clockTime = {
        date: dateObject.getDate(),
        day: dateObject.getDay(),
        hour: dateObject.getHours(),
        minute: dateObject.getMinutes()
      };
      context.display = dateObject.toLocaleDateString('en-US', displayOptions);
    },
    getTime: function() {
      return {
        clockTime: clockTime,
        dateObject: dateObject
      };
    }
  };

});