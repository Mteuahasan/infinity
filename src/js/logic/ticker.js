var universe  = require('./universe')
var displayer = require('../ui/displayer');

var gravity   = new Worker('../src/js/logic/workers/physic.js');

var ticker = {
  run: true,
  speed: 40,
  lastTick: 0,

  init: function() {
    var self = this;
    gravity.postMessage(universe.elements);

    gravity.addEventListener('message', function(e) {
      universe.elements = e.data;
      setTimeout(self.tick, self.speed-(Date.now()-self.lastTick));
    }, false);
  },

  tick: function() {
    displayer.updatePosition(universe.elements);

    ticker.lastTick = Date.now();
    gravity.postMessage(universe.elements);
  }
}

module.exports = ticker;
