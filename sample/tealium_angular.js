/* TealiumHelper.data */

angular.module('TealiumHelper.data', [])
.provider('tealiumData', function() {
  var view_id_map = {};

  return {
    setViewIdMap: function(map) {
      view_id_map = map;
    },
    addViewIdMapEntry: function( key, func ) {
      view_id_map[key] = func; 
    },
    $get: function() {
      return {
        getDataLayer: function(view_id) {
          var dataLayer;
          try {
            if (view_id_map[view_id]){
              dataLayer = view_id_map[view_id]();
            }
            else {
              dataLayer = view_id_map.generic ? view_id_map.generic() : {};
            }
          } catch (err) {
            data = {};
            data.page_type = "generic dataLayer error";
            data.error_name = err.name;
            data.error_message = err.message;
            dataLayer = data;
          }
          return dataLayer;
        }
      }
    }
  };
});


/* TealiumHelper */

angular.module("TealiumHelper", ["TealiumHelper.data"])
.provider("tealium", ["tealiumDataProvider", function( tealiumDataProvider ) {
  var config = {
    environment: "dev",
    suppress_first_view: true
  };

  return {
    setConfig: function( newConfig ) {
      config = newConfig
    },
    setConfigValue: function ( key, value ) {
      config[key] = value
    },
    setViewIdMap: tealiumDataProvider.setViewIdMap,
    addViewIdMapEntry: tealiumDataProvider.addViewIdMapEntry,
    $get: [ "tealiumData", "$location", function(tealiumData, $location) {
      if (!config.account || !config.profile) {
        throw new Error("account or profile value not set.  Please configure Tealium first");
      }

      this.setConfigValue( "script_src", "https://tags.tiqcdn.com/utag/"+ config.account + "/"+ config.profile +"/"+ config.environment + "/utag.js" );

      var view = function( data ) {
        var data = data || tealiumData.getDataLayer( $location.path() );
        track( "view", data );
      };

      var link = function( data ) {
        var data = data || tealiumData.getDataLayer( $location.path() );
        track( "link", data );
      };

      var getScript = function ( src, callback ) {
        var d = document;
        var o = { callback: callback || function(){} };
        var s, t;

        if ( typeof src == "undefined" ) {
          return;
        }

        if ( typeof jQuery != "undefined" ) {
          // use cross-browser getScript from jQuery by default
          jQuery.ajaxSetup({ cache: true });
          jQuery.getScript( src, o.callback );
        } else {
          s = d.createElement("script");s.language="javascript";s.type="text/javascript";s.async=1;s.charset="utf-8";s.src=src;
          if ( typeof o.callback == "function" ) {
            if ( d.addEventListener ) {
              s.addEventListener("load",function(){o.callback()},false);
            } else {
              // old IE support
              s.onreadystatechange=function(){if(this.readyState=="complete"||this.readyState=="loaded"){this.onreadystatechange=null;o.callback()}};
            }
          }
          t = d.getElementsByTagName("script")[0];
          t.parentNode.insertBefore(s, t);
        }

      };

      var track = function( ev, data ) {
        var data = data || tealiumData.getDataLayer( $location.path() );
        var ev = ev || "view";
        var src = config.script_src;

        if ( typeof utag == "undefined" ) {
          getScript( src, function(){
            utag.track( ev, data )
          })
        } else {
          utag.track( ev, data )
        } 
      };

      return {
        view: view,
        link: link,
        track: track,
        setViewIdMap : tealiumDataProvider.setViewIdMap,
        addViewIdMapEntry : tealiumDataProvider.addViewIdMapEntry,
        run: function() {
          if ( typeof utag_data == "undefined" ) {
            window.utag_data = tealiumData.getDataLayer( $location.path() ) || {};
          }
          if ( config.suppress_first_view ) {
            window.utag_cfg_ovrd = { noview : true };
          } else {
            getScript( config.script_src );
          }
        }
      };

    }]
  };
}])
.run(["tealium", function(tealium) {
  tealium.run();
}]);


/* TealiumHelper.directive */

angular.module('TealiumHelper.directive', ['TealiumHelper'])
.directive('tealium', ["$location", "tealiumData", "tealium", function($location, tealiumData, tealium) {
  return {
    restrict: 'A',
    // Add element-specific data to data layer from "data-tealium" attribute
    // <input type="button" value="input button" data-tealium='{"event":"input pressed"}'><br>
    scope: {
      data: '@tealium'
    },
    link: function postLink(scope, element) {

      var link = function(dataLayer) {
        var d = scope.data || "{}";
        var b = {};
          try {
            b = angular.extend({}, JSON.parse(d), dataLayer)
          } catch(error){ };
        tealium.track( "link", b );
      };

      element.bind('click', function(e) {
        var dataLayer = tealiumData.getDataLayer( $location.path() );
        var target = e.target, event_type, event_text, event_source;

        if(target.nodeName) {
          event_type = "" + (target.nodeName.toLowerCase() || target.localName || target.tagName.toLowerCase());
          if(event_type === "a") {
            event_type = "link";
          } else if (event_type == "img") {
            event_type = "image";
          }
          dataLayer['event_type'] = event_type + " click";
        }
        dataLayer['event_target'] = event_type;
        event_text = target.title || target.innerText || target.innerHTML.trim();
        if(event_text === "" && (target.value && target.value !== "")) {
          event_text = target.value;
        } else if(event_text === "" && (target.alt && target.alt !== "")) {
          event_text = target.alt;
        }
        dataLayer['event_attr1'] = event_text;
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
        dataLayer['event_attr2'] = event_source;
        link(dataLayer);
      });
    }
  };
}]);

