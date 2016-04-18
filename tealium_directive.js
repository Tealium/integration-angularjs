var app = angular.module('TealiumHelper.directive', ['TealiumHelper']);
app.directive('tealium', function($location, tealiumData, tealium) {
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
});
