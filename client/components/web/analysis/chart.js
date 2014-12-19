angular.module('ekg.analysis')
// The chartController produces RickShaw graphs for the interval and lorenz
// charts. It utilizes the getResults factory to make http calls and take
// the data from the http call to create the RickShaw graph.
.controller('chartController', function ($scope, getResults, TimeFactory){
  
  // If for some reason the TimeFactory's clock has not yet been set, we
  // will set it here to be UTC = 1420000000000
  if (!TimeFactory.getTime().dateObject) TimeFactory.setTime(1420000000000);

  // This function will call the getChartData function of the getResults
  // Factory with the time that is currently at the start of the long graph
  // in the "Analysis" view. The server will return interval data for the 
  // next 24 R-R intervals, with which we will create a RickShaw graph. 
  $scope.getChartData = function(){
    getResults.getChartData(TimeFactory.getTime().dateObject.getTime())
      .then(function(results){

        document.querySelector("#frequencyChart").innerHTML ='';
        // The graph will be inserted to the div element with id "frequencyChart"
        var graph = new Rickshaw.Graph( {
          element: document.querySelector("#frequencyChart"),
          width: 600,
          height: 400,
          renderer: 'scatterplot',
          stroke: true,
          padding: { top: 0.05, left: 0.05, right: 0.05 },
          series: [ {
            data: results.data,
            color: 'steelblue'
          } ]
        } );
        // Default RickShaw axis labeling methods are used for the y-axis
        var yAxis = new Rickshaw.Graph.Axis.Y({
          graph: graph
        });
        // The tick marks are per every 100px on the x-axis and are without labels
        var x_ticks = new Rickshaw.Graph.Axis.X({
          graph: graph,
          pixelsPerTick: 100,
          tickFormat: function(n) {
            var map = {
              0: '',
              1: '',
              2: '',
              3: '',
              4: ''
            };
            return map[n];
          }
        });
        // Each component needs to call its render function. 
        yAxis.render();
        x_ticks.render();
        graph.render();
      })
      .catch(function(err){
        console.log('$http error in interval chart', err);
      });
  };

  // Immediately call the getChartData() function when the controller is run.
  $scope.getChartData();

  // This function calls the getLorenzData function in the factory and obtains
  // the lorenz graph data points from the server. It performs a similar set of 
  // operations as getChartData and plots the data in RickShaw
  $scope.getLorenzData = function(){
    getResults.getLorenzData(TimeFactory.getTime().dateObject.getTime())
      .then(function(results){
        document.querySelector("#lorenzChart").innerHTML ='';
        var graph = new Rickshaw.Graph( {
          element: document.querySelector("#lorenzChart"),
          width: 400,
          height: 400,
          renderer: 'scatterplot',
          stroke: true,
          padding: { top: 0.05, left: 0.05, right: 0.05 },
          series: [ {
            data: results.data,
            color: 'green'
          } ]
        } );
        var yAxis = new Rickshaw.Graph.Axis.Y({
          graph: graph
        });
        var x_ticks = new Rickshaw.Graph.Axis.X({
          graph: graph,
          pixelsPerTick: 100,
          tickFormat: function(n) {
            var map = {
              0: '',
              1: '',
              2: '',
              3: '',
              4: ''
            };
            return map[n];
          }
        });
        yAxis.render();
        x_ticks.render();
        graph.render();
      })
      .catch(function(err){
        console.log('$http error for lorenz chart', err);
      });
  };

  // GetLorenzData is also immediately invoked upon the controller being run.
  $scope.getLorenzData();

})

// The getResults factory will make $http calls to the server to obtain analysis results
.factory('getResults', function ($http){

  return {

    // The server route for the interval analysis is users/analysis.
    // We attach the time stamp with the request to get the data aligned
    // with the start of the long graph.
    getChartData: function (time){
      return $http({
        method: 'POST',
        url: '/users/analysis',
        data: {
          time: time
        }
      });
    },

    // The server route for the lorenz analysis is users/lorenz.
    getLorenzData: function(time){
      return $http({
        method: 'POST',
        url: '/users/lorenz',
        data: {
          time: time
        }
      });
    }
  };

});