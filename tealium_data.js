angular.module('TealiumUDO', [])
   .factory('tealium_udo', ['$location', function($location){
      return function(config, e) {
          var udo = {};
          try {
            var view_id = config.view_id;
            var data_connector = config.data_connector;
            
            var home = function(){
              var data = {
                  "page_type" : "home",
                  "view_id"   : view_id,
                  "date"      : Date(),
                  "key"       :"value"
                };
                return data;
            }
            
            var product = function() {
              var data = {
                  "page_type" : "product",
                  "view_id"   : view_id,
                  'location' : $location.path(),
                  "key2"  : "value2"
               };
               return data;
            }
            
            var generic = function() {
              var data = {
                  "page_type" : "generic",
                  "view_id"   : view_id,
                  'location' : $location.path(),
                  "key"  : "generic value"
               };
               return data;
            }
            
            var view_id_map = {
              '/template1.html' : home,
              '/template2.html' : product,
              'generic'         : generic
              
            };
            
// DO NOT EDIT BELOW THIS LINE ---------------------------------------------------------   
            if (view_id_map[view_id]){
              udo = view_id_map[view_id]();
            }
            else {
              udo = view_id_map["generic"]();
            }
          }
          catch(e) {
            data = {};
            data.page_type = "generic udo error";
            data.error_name = e.name;
            data.error_message = e.message;
            udo = data;
          }
          
          if (udo && typeof udo == "object"){
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
            return udo;
          }
          else {
            data = {};
            data.page_type = "generic";
            data.data = "no data found for udo, please check setup of tealium_data.js";
            udo = data;
            return udo;
          }
      };
   }]);
