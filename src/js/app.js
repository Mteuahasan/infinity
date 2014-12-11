var $ = require('./tools');
var _ = require('lodash');

var universe = require('./logic/universe');

document.addEventListener('DOMContentLoaded', function() {
  $.get('/data.json', function(d) {
    universe.init(d.elements);
  });
});
