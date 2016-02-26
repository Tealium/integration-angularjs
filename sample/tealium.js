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
      // replaced with tealium_directive
      // var link = function(udo) {
      //   var b = {};
      //   angular.forEach(udo, function(value, key) {
      //     b[key] = value;
      //   });
      //   window.utag.link(b);
      // };

      var view = function() {
        var udo = tealiumData.getUdo($location.path());
        if (window.utag){
          window.utag.view(udo);
          // replaced by tealium_directive
          // if (config.ui_selectors) {
          //   angular.element(document.querySelectorAll(config.ui_selectors))
          //     .bind('click', function(e) {
          //       var udo = tealiumData.getUdo($location.path(), e);
          //       link(udo);
          //     });
          // }
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
