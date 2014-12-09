angular.module('TealiumUDO', [])
   .value('tealium_udo', {
      udo: {
       'home' : {
         description : 'home',
         data : {
           init : function(data) {
             var self = udo;
             self.key1 = Date();
             self.key2 = "test";
             
           }
         }
       },
        '/my/path/product.html' : {
         description : 'product',
         data : {
           init : function(data) {
             var self = udo;
             self.key1 = Date();
             self.key2 = "test";
           }
         }
       }
     },
   });