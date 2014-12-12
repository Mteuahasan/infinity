var $ = require('./tools');
var _ = require('lodash');

var universe = require('./logic/universe');

window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          };
})();


document.addEventListener('DOMContentLoaded', function() {
  $.get('/data.json', function(d) {
    universe.init(d.elements);
  });
});
