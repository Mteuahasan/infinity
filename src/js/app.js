'use strict';

var $ = require('./tools');
var _ = require('lodash');

var universe = require('./logic/universe');
var ticker   = require('./logic/ticker');

var informations = require('./ui/informations');
var interactions = require('./ui/interactions');
var displayer    = require('./ui/displayer');

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
    else if (e.keyCode === 82) {
      displayer.showHideHelpers();
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

  universe.init();
  informations.init();
  interactions.init();
});
