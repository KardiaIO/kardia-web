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
      scope.$watchCollection('[data, renderer]', function(newVal, oldVal){
        console.log('watcher running');
        if(!newVal[0]){
          return;
        }

        element[0].innerHTML ='';

        var graph = new Rickshaw.Graph({
          element: element[0],
          width: attrs.width,
          height: attrs.height,
          min: 'auto',
          series: [{data: scope.data.results, color: attrs.color1}, {data: scope.data.indicators, color: attrs.color2}],
          renderer: scope.renderer
        });

        graph.render();
      });
    }
  };
});
