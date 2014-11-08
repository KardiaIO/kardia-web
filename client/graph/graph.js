    angular.module('ekg')
    .controller('MainController', function ($scope, $http) {
      $http.get('/graph/sightings.json').success(function(result){
        $scope.sightings = result;

        $scope.renderer = 'line';

        $scope.sightingsByDate = _(result)
          .chain()
          .countBy(function(sighting){return sighting.sightedAt.$date;})
          .pairs()
          .map(function(pair){
            return {
              x: new Date(parseInt(pair[0])).getTime()/1000,
              y: pair[1]
            };
          })
          .sortBy(function(dateCount){return dateCount.x;})
          .value();

      })
    });
