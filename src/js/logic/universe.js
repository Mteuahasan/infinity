var _ = require('lodash');

var displayer = require('../ui/displayer');

// Number of elements
var N = 1100;

var universe = {
  elements: [],

  init: function(elements) {
    var self = this;
    var speed = 0;
    var r1 = 0, r2 = 0, r3 = 0, sum = 0, tempSpeed = 0, ratio = 0;
    for (var i=0;i<N;i++) {
      clone = _.cloneDeep(elements[0]);

      speed = Math.random()*10+10;

      // randomize speed on each axis
      r1 = Math.random();
      r2 = Math.random();
      r3 = Math.random();
      sum = r1 + r2 + r3;

      // get the real speed on each axis
      tempSpeed = Math.sqrt(Math.pow((r1/sum)*speed,2)+Math.pow((r2/sum)*speed,2)+Math.pow((r3/sum)*speed,2));
      ratio = speed/tempSpeed;

      clone.vX = (r1/sum)*speed*ratio;
      clone.vY = (r2/sum)*speed*ratio;
      clone.vZ = (r3/sum)*speed*ratio;

      // make it positive or negative
      clone.vX *= Math.round(Math.random()) == 1 ? 1 : -1;
      clone.vY *= Math.round(Math.random()) == 1 ? 1 : -1;
      clone.vZ *= Math.round(Math.random()) == 1 ? 1 : -1;

      self.elements.push(clone);
    }

    displayer.init(self.elements);
  }
};

module.exports = universe;
