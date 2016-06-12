require('./style.css');

function timeInputDirective() {
  return {
    template: require('./template.html'),
    restrict: 'E',
    link: function($scope, $element, $attrs) {
    }
  }
}

module.exports = function(mod) {
  mod.directive('timeInput', timeInputDirective);
}