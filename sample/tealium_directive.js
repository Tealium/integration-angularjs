var app = angular.module('TealiumHelper.directive', ['TealiumHelper']);
app.directive('tealium', function($location, tealiumData) {
  return {
    restrict: 'A',
    scope: {
      data: '@tealium'
    },
    link: function postLink(scope, element) {
      var link = function(udo) {
        var b = angular.extend({}, scope.data, udo);
        window.utag.link(b);
        console.log('linked: ', b);
      };
      element.bind('click', function(e) {
        var udo = tealiumData.getUdo($location.path());
        var target = e.target, event_type, event_text, event_source;
        if(target.nodeName) {
          event_type = "" + (target.nodeName.toLowerCase() || target.localName || target.tagName.toLowerCase());
          if(event_type === "a") {
            event_type = "link";
          }
          else if (event_type == "img") {
            event_type = "image";
          }
          udo['event_type'] = event_type + " click";
        }
        udo['event_target'] = event_type;
        event_text = target.title || target.innerText || target.innerHTML.trim();
        if(event_text === "" && (target.value && target.value !== "")) {
          event_text = target.value;
        } else if(event_text === "" && (target.alt && target.alt !== "")) {
          event_text = target.alt;
        }
        udo['event_attr1'] = event_text;
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
        udo['event_attr2'] = event_source;
        link(udo);
      });
    }
  };
});
