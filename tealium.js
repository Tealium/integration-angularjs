 angular.module('TealiumConfigure', [])
  .factory('tealium_configure', [function(){
      // import any modules and setup here for view_id and data_connector
      
      return {
        "uiSelectors": '.trackable, input', // elements to be autotracked
        "view_id": "home",      // place reference or function to return unique key for current view
        "data_connector" : {},  // place reference or function to return data model
        "account" : "tealiummobile",  // add tealium account name
        "profile" : "demo",           // add profile name to use
        "environment" : "dev"         // add target environment to use
      }
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
         key = tealium_configure.view_id;
         udo = tealium_udo.udo[key] ? tealium_udo.udo[key]['data'] : {};
         udo.init(tealium_configure.data_connector);
         if (window.utag){
         utag.view(udo);
         angular.element(document.querySelectorAll(tealium_configure.uiSelectors))
           .bind('click', function(e) {
             link(udo, e);
           });
         }
       };

      return {"view": view,
              "link": link};
              
   }])
   .run(function(tealium_configure) {
     // like main when class is called
     (function(a, b, c, d) {
       a = '//tags.tiqcdn.com/utag/'
        + tealium_configure.account
        +'/'+ tealium_configure.profile
        +'/'+ tealium_configure.environment
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