var universe  = require('./universe');
var displayer = require('../ui/displayer');

var gravity   = require('./gravity');

var ticker = {
  run: true,
  speed: 0,
  lastTick: 0,
  ticks: 0,
  meter: null,

  init: function() {
    var self = this;

    self.meter = new FPSMeter({
      theme  : 'light',
      heat   : true,
      graph  : true,
      left:     'auto',    // Meter left offset.
      right:    '5px',     // Meter right offset.
      history: 20
    });

    self.tick();
  },

  tick: function() {
    var self = this;
    var elements = gravity.computeVelocity(0, universe.elements, ticker.ticks)
    displayer.updatePosition(elements);

    ticker.ticks++;
    ticker.meter.tick();
    ticker.lastTick = Date.now();
    if (ticker.run)
      setTimeout(ticker.tick, ticker.speed-(Date.now()-ticker.lastTick));
  }
};

module.exports = ticker;
