var universe  = require('./universe');
var displayer = require('../ui/displayer');

var gravity   = new Worker('../src/js/logic/workers/physic.js');

var ticker = {
  run: true,
  speed: 40,
  lastTick: 0,
  ticks: 0,

  init: function() {
    var self = this;
    gravity.postMessage({elements: universe.elements, ticks: self.ticks});

    gravity.addEventListener('message', function(e) {
      self.ticks++;
      universe.elements = e.data;
      if (self.run)
        setTimeout(self.tick, self.speed-(Date.now()-self.lastTick));
    }, false);
  },

  tick: function() {
    displayer.updatePosition(universe.elements);

    ticker.lastTick = Date.now();
    gravity.postMessage({elements: universe.elements, ticks: ticker.ticks});
  }
};

module.exports = ticker;
