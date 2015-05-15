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
      var config = new tealium_configure();
      var link = function(udo, e) {
        var config = new tealium_configure();
        var b = {},target = e.target, event_type, event_text, event_source;
        angular.forEach(udo, function(value, key) {
          b[key] = value;
        });

        if(target.nodeName) {
          event_type = "" + (target.nodeName.toLowerCase() || target.localName || target.tagName.toLowerCase());
          if(event_type === "a") {
            event_type = "link";
          }else if (event_type == "img") {
            event_type = "image";
          }
          b['event_type'] = event_type + " click";
        }
        b['event_target'] = event_type;
        event_text = target.title || target.innerText || target.innerHTML.trim();
        if(event_text === "" && (target.value && target.value !== "")) {
          event_text = target.value;
        }else if(event_text === "" && (target.alt && target.alt !== "")) {
          event_text = target.alt;
        }
        b['event_attr1'] = event_text;
        if(event_type === "link") {
          event_source = target.href;
        }else if (event_type === "button") {
          event_source = target.type || "";
        }else if (event_type === "input") {
          event_source = target.value || "";
        }else if (target.src && target.src !== "") {
          event_source = target.src;
        }
        b['event_attr2'] = event_source;

        if(target.attributes['data-tealium']) {
          var custom_data = target.attributes['data-tealium'].value;
          custom_data = JSON.parse(custom_data);
          angular.forEach(custom_data, function(value, key) {
            b[key] = value;
          });
      }
      utag.link(b);
    };

      var view = function() {
         var config = new tealium_configure();
         var udo = tealium_udo(config);
         if (window.utag){
           utag.view(udo);
           angular.element(document.querySelectorAll(config.ui_selectors))
             .bind('click', function(e) {
               link(udo, e);
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
