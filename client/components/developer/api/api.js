angular.module('ekg.api', [])

.controller('APIController', function ($scope) {
  $scope.generateKey = function() {
  	//return generated API key and store it to user's mongodb obj
  	console.log("Here's your API key! Keep it safe!");
  	//if already have an API key, hide button and show "Show API key" button instead
  };
});