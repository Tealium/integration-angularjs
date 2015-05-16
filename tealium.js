angular.module('TealiumConfigure', [])
  .factory('tealium_configure', ["$location", function($location){
      return function() {
        // import any modules and setup here for view_id and data_connector
        var view_id = $location.path();
        view_id = !(/undefined|^$/i).test(view_id) ? view_id : '/template1.html'; // fall back in case $location.path() isnt ready
         
        this.view_id = view_id;            // place reference or function to return unique key for current view

        this.data_connector  = {};                  // place reference or function to return data model
        this.ui_selectors    = '.trackable, input'; // elements to be autotracked *this is a sample*
        this.account     = "tealiummobile";         // add tealium account name
        this.profile     = "demo";                  // add profile name to use
        this.environment = "dev";                   // add target environment to use
        this.suppress_first_view = true;           // true means utag.view() is not fired when library is loaded initially
        
// DO NOT EDIT BELOW THIS LINE ---------------------------------------------------------            
      };
    }
  ]);

 
 angular.module('TealiumHelper', ['TealiumUDO', 'TealiumConfigure'])
   .factory('tealium', ['tealium_configure', 'tealium_udo', function(tealium_configure, tealium_udo) {
      var config = new tealium_configure();
      var link = function(udo, e) {
         var config = new tealium_configure();
         var b = {};
         angular.forEach(udo, function(value, key) {
           b[key] = value;
         });

         utag.link(b);
       };

      var view = function() {
         var config = new tealium_configure();
         var udo = tealium_udo(config);
         if (window.utag){
           utag.view(udo);
           angular.element(document.querySelectorAll(config.ui_selectors))
             .bind('click', function(e) {
               var udo = tealium_udo(config, e);
               link(udo);
             });
         }
       };

      return {"view": view};
              
   }])
   .run(function(tealium_configure) {
     // like main when class is called
     var config = new tealium_configure();
     if (config.suppress_first_view){
       window.utag_cfg_ovrd = {noview : true};
     }
     (function(a, b, c, d) {
       a = '//tags.tiqcdn.com/utag/'
        + config.account
        +'/'+ config.profile
        +'/'+ config.environment
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
