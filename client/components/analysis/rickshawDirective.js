angular.module('ekg.home')
.directive('rickshawChart', function () {
  return {
    scope: {
      data: '=',
      renderer: '='
    },
    template: '<div></div>',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      var graph;
      scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
        if(!newVal[0]){
          return;
        }
        
        element[0].innerHTML ='';
        // When new data is loaded, graph is configured with new data instead of rerendering
        if (graph){
          graph.config({
            element: element[0],
            series: [
              {data: scope.data.results, color: attrs.color1}
              // {data: scope.data.indicators, color: attrs.color2}
            ],
            renderer: scope.renderer
          });
        } else {
          // Render graph on initial load
          graph = new Rickshaw.Graph({
            element: element[0],
            width: attrs.width,
            height: attrs.height,
            min: attrs.min,
            max: attrs.max,
            series: [
              {data: scope.data.results, color: attrs.color1}
              // {data: scope.data.indicators, color: attrs.color2}
            ],
            renderer: scope.renderer
          });
        }

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
