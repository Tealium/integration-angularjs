angular.module('TealiumUDO', [])
   .factory('tealium_udo', ['$location', function($location){
      var get_udo = function(config) {
          var view_id = config.view_id;
          var data_connector = config.data_connector;
          
          var udo = {
           '/template1.html' : {
              description : "home",
              data: {
                "date" : Date(),
                "key"  :"value"
              }
           },
            '/template2.html' : {
             description : 'product',
             data : {
                'location' : $location.path(),
                "key2"  : "value2"
             }
           }
         };
         
         return udo[view_id];
      }
      return get_udo;
   }]);