var app = angular.module("TealiumHelper", ["TealiumHelper.data"]);

app.provider("tealium", ["tealiumDataProvider", function(tealiumDataProvider) {
  var config = {
    account: "",
    profile: "",
    environment: "dev",
    suppress_first_view: true
  };

  return {
    setConfig: function(newConfig) {
      config = newConfig
    },
    setConfigValue: function ( key, value ) {
      config[key] = value
    },
    setViewIdMap: tealiumDataProvider.setViewIdMap,
    $get: [ "tealiumData", "$location", function(tealiumData, $location) {
      if (!config.account || !config.profile) {
        throw new Exception("Please configure Tealium first");
      }

      this.setConfigValue( "script_src", "//tags.tiqcdn.com/utag/"+ config.account + "/"+ config.profile +"/"+ config.environment + "/utag.js" );

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
}]);
app.run(["tealium", function(tealium) {
  tealium.run();
}]);
