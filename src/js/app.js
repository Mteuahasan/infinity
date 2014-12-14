var $ = require('./tools');
var _ = require('lodash');

var universe = require('./logic/universe');
var ticker   = require('./logic/ticker')

window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function(callback) {
            window.setTimeout(callback, 1000/60);
          };
})();

document.addEventListener('DOMContentLoaded', function() {

  window.addEventListener('keyup', function(e) {
    if (e.keyCode === 32) {
      ticker.run = !ticker.run;
      if (ticker.run)
        ticker.tick();
    }
  });

  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 65 && ticker.speed > 0) {
      ticker.speed -= 10;
    }
    else if (e.keyCode === 90) {
      ticker.speed += 10;
    }
  });

  $.get('/data.json', function(d) {
    universe.init(d.elements);
  });
});
