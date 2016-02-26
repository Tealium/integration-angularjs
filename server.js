'use strict';
var
  express = require('express'),
  app = express();

app.use(express.static('sample'));

app.listen(3000, function() {
  console.log('express listening on port 3000');
});
