angular.module('TealiumHelper', [])
  .provider('tealiumData', function() {
    'use strict';

    var
      udo = {},
      view_id_map = {};

    return {
      // Accessible in config block
      set_view_id_map: function(map) {
        view_id_map = map;
      },
      // Called when tealiumData service is injected
      $get: function($location) {
        return {
          udo: udo,
          update: function(e) {
            try {
              if (view_id_map[$location.path()]){
                udo = view_id_map[$location.path()]();
              }
              else {
                udo = view_id_map.generic ? view_id_map.generic() : {};
              }
            } catch(e) {
              var data = {};
              data.page_type = "generic udo error";
              data.error_name = e.name;
              data.error_message = e.message;
              udo = data;
            }

            if (e){
              var target = e.target, event_type, event_text, event_source;
              if(target.nodeName) {
                event_type = "" + (target.nodeName.toLowerCase() || target.localName || target.tagName.toLowerCase());
                if(event_type === "a") {
                  event_type = "link";
                } else if (event_type == "img") {
                  event_type = "image";
                }
                udo['event_type'] = event_type + " click";
              }
              udo['event_target'] = event_type;
              event_text = target.title || target.innerText || target.innerHTML.trim();
              if(event_text === "" && (target.value && target.value !== "")) {
                event_text = target.value;
              } else if(event_text === "" && (target.alt && target.alt !== "")) {
                event_text = target.alt;
              }
              udo['event_attr1'] = event_text;
              switch(event_type){
                case "link":
                  event_source = target.href;
                  break;
                case "button":
                  event_source = target.type || "";
                  break;
                case "input":
                  event_source = target.value || "";
                  break;
                default:
                  if (target.src && target.src !== "") {
                    event_source = target.src;
                  }
                  break;
              }
              udo['event_attr2'] = event_source;

              if (target.attributes['data-tealium']) {
                var custom_data = target.attributes['data-tealium'].value;
                custom_data = JSON.parse(custom_data);
                angular.forEach(custom_data, function(value, key) {
                  udo[key] = value;
                });
              }
            }
          }
        };
      }
    };
  });
  .provider('tealium', function(tealiumData) {
    'use strict';

    var config = {
      ui_selectors: '',
      account: '',
      profile: '',
      environment: '',
      suppress_first_view: true
    };

    return {
      // Available in Config Block
      config: config,
      // Called when service is injected
      $get: function() {
        var link = function(udo) {
          var b = {};
          angular.forEach(udo, function(value, key) {
            b[key] = value;
          });

          utag.link(b);
        };

        var view = function() {
          tealiumData.update();
          var udo = tealiumData.udo;
          if (window.utag) {
            utag.view(udo);
            if (ui_selectors) {
              angular.element(document.querySelectorAll(config.ui_selectors))
                .bind('click', function(e) {
                  var udo = tealium_udo(config, e);
                  link(udo);
                });
            }
          }
         };

        return {"view": view};
      }
     }
   };
  })
  .run(function(tealium) {
    // like main when class is called
    var config = tealium.config;
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
   });
