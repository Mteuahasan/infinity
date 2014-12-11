var displayer = require('../ui/displayer');
var gravity   = require('./gravity');

var ticker = {
  tick: function() {
    var start = Date.now();

    var elements = gravity.computeVelocity(0);
    displayer.updatePosition(elements);
    var delta = Date.now() - start;
    setTimeout(ticker.tick, 30-delta);
  }
}

module.exports = ticker;
