var displayer = require('../ui/displayer');
var gravity   = require('./gravity');

var ticker = {
  run: true,
  speed: 30,

  init: function() {

  },

  tick: function() {
    var start = Date.now();

    var elements = gravity.computeVelocity(0);
    displayer.updatePosition(elements);
    var delta = Date.now() - start;
    if (ticker.run)
      setTimeout(ticker.tick, ticker.speed-delta);
  }
}

module.exports = ticker;
