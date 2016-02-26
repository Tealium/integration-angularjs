var app = angular.module('TealiumHelper.data', []);

app.provider('tealiumData', function() {
  var view_id_map = {};

  return {
    setViewIdMap: function(map) {
      view_id_map = map;
    },
    $get: function() {
      return {
        getUdo: function(view_id, evt) {
          var udo;
          try {
            if (view_id_map[view_id]){
              udo = view_id_map[view_id]();
            }
            else {
              udo = view_id_map.generic ? view_id_map.generic() : {};
            }
          } catch (err) {
            data = {};
            data.page_type = "generic udo error";
            data.error_name = err.name;
            data.error_message = err.message;
            udo = data;
          }
          if (evt) {
            var target = evt.target, event_type, event_text, event_source;
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

             if (target.attributes['data-tealium']) {
              var custom_data = target.attributes['data-tealium'].value;
              custom_data = JSON.parse(custom_data);
              angular.forEach(custom_data, function(value, key) {
                udo[key] = value;
              });
            }
            console.log('view triggered with event: ', evt);
          }
          console.log('updated udo: ', udo);
          return udo;
        }
      }
    }
  };
});
