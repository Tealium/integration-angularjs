var app = angular.module('TealiumHelper.data', []);

app.provider('tealiumData', function() {
  var view_id_map = {};

  return {
    setViewIdMap: function(map) {
      view_id_map = map;
    },
    $get: function() {
      return {
        getUdo: function(view_id) {
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
          return udo;
        }
      }
    }
  };
});
