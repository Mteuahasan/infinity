var universe  = require('./universe')
var displayer = require('../ui/displayer');

var gravity   = new Worker('../src/js/logic/workers/gravity.js');

var ticker = {
  run: true,
  speed: 40,

  init: function() {
    var self = this;
    gravity.postMessage(universe.elements);

    gravity.addEventListener('message', function(e) {
      universe.elements = e.data;

      self.tick();
    }, false);
  },

  tick: function() {
    var start = Date.now();

    displayer.updatePosition(universe.elements);
    var delta = Date.now() - start;
    if (ticker.run) {
      setTimeout(function() {
        gravity.postMessage(universe.elements);
      }, ticker.speed-delta);
    }
  }
}

module.exports = ticker;
