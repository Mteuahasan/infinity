'use strict';

var universe     = require('./universe');
var displayer    = require('../ui/displayer');
var informations = require('../ui/informations');

var gravity   = require('./gravity');

var ticker = {
  run: true,
  speed: 0,
  lastTick: 0,
  ticks: 0,

  init: function() {
    var self = this;
  },

  tick: function() {
    var self = this;
    var data = gravity.computeVelocity(0, universe.elements, ticker.ticks);

    displayer.updatePositions(data.elements);
    informations.updateSpeed(data.speed);

    ticker.ticks++;
    ticker.lastTick = Date.now();
    if (ticker.run)
      setTimeout(ticker.tick, ticker.speed-(Date.now()-ticker.lastTick));
  }
};

module.exports = ticker;
