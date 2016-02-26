var app = angular.module('TealiumHelper.directive', ['TealiumHelper']);
app.directive('tealium', function($location, tealiumData) {
  return {
    restrict: 'A',
    scope: {
      data: '@tealium'
    },
    link: function postLink(scope, element) {
      var link = function(udo) {
        var b = {};
        angular.forEach(udo, function(value, key) {
          b[key] = value;
        });
        window.utag.link(b);
      };
      element.bind('click', function(e) {
        var udo = tealiumData.getUdo($location.path(), e);
        link(udo);
      });
    }
  };
});
