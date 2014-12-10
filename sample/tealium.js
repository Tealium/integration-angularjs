 angular.module('TealiumConfigure', [])
  .factory('tealium_configure', ["$location", function($location){
      var get_config = function() {
        // import any modules and setup here for view_id and data_connector
        
        var view_id = $location.path();            // place reference or function to return unique key for current view
        var data_connector  = {};                  // place reference or function to return data model
        var ui_selectors    = '.trackable, input'; // elements to be autotracked *this is a sample*
        var account     = "tealiummobile";         // add tealium account name
        var profile     = "demo";                  // add profile name to use
        var environment = "dev";                   // add target environment to use
        
// DO NOT EDIT BELOW THIS LINE ---------------------------------------------------------            
        return {
            "uiSelectors": ui_selectors,
            "view_id": view_id,
            "data_connector" : data_connector,
            "account" : account,
            "profile" : profile,
            "environment" : environment
        };
      };
      return get_config;
    }
  ]);

 
 angular.module('TealiumHelper', ['TealiumUDO', 'TealiumConfigure'])
   .factory('tealium', ['tealium_configure', 'tealium_udo', function(tealium_configure, tealium_udo) {
      var link = function(udo, e) {
         var b = {};
         angular.forEach(udo, function(value, key) {
           b[key] = value;
         });
         if (e.target.attributes['data-tealium']) {
           var custom_data = e.target.attributes['data-tealium'].value;
           custom_data = JSON.parse(custom_data);
           angular.forEach(custom_data, function(value, key) {
             b[key] = value;
           });
         }
         utag.link(b);
       };

      var view = function() {
         udo = tealium_udo(tealium_configure()) ? tealium_udo(tealium_configure())["data"] : {};
         if (window.utag){
         utag.view(udo);
         angular.element(document.querySelectorAll(tealium_configure().uiSelectors))
           .bind('click', function(e) {
             link(udo, e);
           });
         }
       };

      return {"view": view};
              
   }])
   .run(function(tealium_configure) {
     // like main when class is called
     (function(a, b, c, d) {
       a = '//tags.tiqcdn.com/utag/'
        + tealium_configure().account
        +'/'+ tealium_configure().profile
        +'/'+ tealium_configure().environment
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

   });