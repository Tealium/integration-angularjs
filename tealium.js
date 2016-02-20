angular.module('TealiumHelper', ['TealiumUDO'])
  .provider('tealium', ['$location', 'tealium_udo', function($location, tealium_udo) {
    'use strict';
    // default values set here. Should be configured via provider in config block
    var
      ui_selectors = '.trackable, input',
      account = 'testAccount',
      profile = 'testProfile',
      environment = 'dev',
      suppress_first_view = true;

    return {
      set_ui_selectors: function(selectors) {
        ui_selectors = selectors;
      },
      set_account: function(acct) {
        account = acct;
      },
      set_profile: function(prof) {
        profile = prof;
      },
      set_environment: function(env) {
        environment = env;
      },
      set_suppress_first_view: function(suppress) {
        suppress_first_view = suppress;
      },

      $get: function() {
        var link = function(udo) {
          var b = {};
          angular.forEach(udo, function(value, key) {
            b[key] = value;
          });
          utag.link(b);
        };

        var view = function() {
          var udo = tealium_udo;
          if (window.utag){
            utag.view(udo);
            angular.element(document.querySelectorAll(ui_selectors))
            .bind('click', function(e) {
              var udo = tealium_udo.update(e);
              link(udo);
            });
          }
       };

       // like main when class is called
       if (suppress_first_view){
         window.utag_cfg_ovrd = {noview : true};
       }
       (function(a, b, c, d) {
         a = '//tags.tiqcdn.com/utag/'
          + account
          +'/'+ profile
          +'/'+ environment
          +'/utag.js';
         b = document;
         c = 'script';
         d = b.createElement(c);
         d.src = a;
         d.type = 'text/java' + c;
         d.async = true;
         a = b.getElementsByTagName(c)[0];
         a.parentNode.insertBefore(d, a);
       })();

       return {"view": view};
      }
    }
  }]);
