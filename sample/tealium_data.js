angular.module('TealiumUDO', [])
   .factory('tealium_udo', ['$location', function($location){
      return function(config) {
          udo = {};
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