var app = angular.module('TealiumHelper', ['TealiumHelper.data']);

app.provider('tealium', function(tealiumDataProvider) {
  var config = {
    account: '',
    profile: '',
    environment: 'dev',
    suppress_first_view: true,
    ui_selectors: ''
  };

  return {
    config: function(newConfig) {
      config = newConfig;
    },
    setViewIdMap: tealiumDataProvider.setViewIdMap,
    $get: function(tealiumData, $location) {
      if (!config.account || !config.profile) {
        throw new Exception("Please configure Tealium first");
      }
      var view = function() {
        var udo = tealiumData.getUdo($location.path());
        if (window.utag){
          window.utag.view(udo);
        }
      };

      return {
        view: view,
        run: function() {
          if (config.suppress_first_view){
            window.utag_cfg_ovrd = {noview : true};
          }
          (function(a, b, c, d) {
            a = '//tags.tiqcdn.com/utag/'+
            config.account + '/'+
            config.profile +'/'+
            config.environment +
            '/utag.js';
            b = document;
            c = 'script';
            d = b.createElement(c);
            d.src = a;
            d.type = 'text/java' + c;
            d.async = true;
            a = b.getElementsByTagName(c)[0];
            a.parentNode.insertBefore(d, a);
          })();
        }
      };
    }
  };
});
app.run(function(tealium) {
  tealium.run();
});
