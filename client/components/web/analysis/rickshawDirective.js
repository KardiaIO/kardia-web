angular.module('ekg.analysis')
// The rickshawChart is responsible for producing the long and short graphs of the EKG 
// on the main "analysis" view but not for the interval or lorenz detailed analysis views.
.directive('rickshawChart', function () {
  return {
    scope: {
      data: '=',
      renderer: '='
    },
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
        if(!newVal[0]){
          return;
        }
        // The element we are inserting the rickShaw graph into must be emptied. 
        element[0].innerHTML ='';

        // Render graph on initial load
        var graph = new Rickshaw.Graph({
          element: element[0],
          width: attrs.width,
          height: attrs.height,
          min: attrs.min,
          max: attrs.max,
          series: [
            {data: scope.data.results, color: attrs.color1},
            {data: scope.data.indicators, color: attrs.color2}
          ],
          renderer: scope.renderer
        });

        // Add y-axis axes
        var yAxis = new Rickshaw.Graph.Axis.Y({
          graph: graph
        });

        // Create x-axis axes with no text
        var format = function(n) {
          var map = {
            0: '',
            1: '',
            2: '',
            3: '',
            4: ''
          };
          return map[n];
        };

        var x_ticks = new Rickshaw.Graph.Axis.X( {
          graph: graph,
          pixelsPerTick: 200,
          tickFormat: format
        } );

        // Render graph and axes
        yAxis.render();
        x_ticks.render();
        graph.render();

      });
    }
  };
});
