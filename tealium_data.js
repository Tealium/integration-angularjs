angular.module('TealiumUDO', [])
  .provider('tealium_udo', ['$location', function($location) {
    'use strict';
    // default values set here. Should be configured via provider in config block
    var
      udo = {},
      view_id_map = {};

    return {
      set_udo: function(newUDO) {
        udo = newUDO;
      },
      extend_udo: function(newUDO) {
        angular.extend(udo, newUDO);
      },
      set_view_id_map: function(map) {
        view_id_map = map;
      },
      extend_view_id_map: function(map) {
        angular.extend(view_id_map, map);
      },

      $get: function() {
        try {
          if (view_id_map[view_id]){
            udo = view_id_map[view_id]();
          }
          else {
            udo = view_id_map["generic"]();
          }
        } catch(e) {
          data = {};
          data.page_type = "generic udo error";
          data.error_name = e.name;
          data.error_message = e.message;
          udo = data;
        }

        if (udo && typeof udo == "object"){
          return {
            udo: udo,
            update: function(e) {
              if (e){
               var target = e.target, event_type, event_text, event_source;
               if(target.nodeName) {
                  event_type = "" + (target.nodeName.toLowerCase() || target.localName || target.tagName.toLowerCase());
                  if(event_type === "a") {
                     event_type = "link";
                  }
                  else if (event_type == "img") {
                     event_type = "image";
                  }
                  udo['event_type'] = event_type + " click";
               }
               udo['event_target'] = event_type;
               event_text = target.title || target.innerText || target.innerHTML.trim();
               if(event_text === "" && (target.value && target.value !== "")) {
                  event_text = target.value;
               }else if(event_text === "" && (target.alt && target.alt !== "")) {
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
        else {
          data = {};
          data.page_type = "generic";
          data.data = "no data found for udo, please check setup of tealium_data.js";
          udo = data;
          return udo;
        }
      }
    };
  }]);
