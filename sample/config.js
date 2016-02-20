angular.module('TestModule', ['TealiumHelper'])
  .config(['$location', 'tealium_udoProvider', 'tealiumProvider'],
    function($location, tealium_udo_provider, tealium_provider) {

      var view_id = $location.path || 'index.html';

      var home = function() {
        var data = {
          "page_type" : "home",
          "view_id"   : view_id,
          "date"      : Date(),
          "key"       :"value"
        };
        return data;
      };
      var product = function() {
        var data = {
          "page_type" : "product",
          "view_id"   : view_id,
          'location' : $location.path(),
          "key2"  : "value2"
        };
        return data;
      };
      var generic = function() {
        var data = {
          "page_type" : "generic",
          "view_id"   : view_id,
          'location' : $location.path(),
          "key"  : "generic value"
        };
        return data;
      };

      tealium_udo_provider.set_view_id_map = {
        '/template1.html' : home,
        '/template2.html' : product,
        'generic'         : generic
      };

      tealium_udo_provider.set_udo({
        test1: 'a',
        test2: 'b'
      });

      tealiumProvider.set_account('my account');
      tealiumProvider.set_profile('my profile');
      tealiumProvider.set_environment('dev');

    })
