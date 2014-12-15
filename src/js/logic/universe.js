var _ = require('lodash');

var displayer = require('../ui/displayer');

// Number of elements
var N = 100;

var universe = {
  elements: [],

  init: function(elements) {
    var self = this;
    var speed = 0;
    var r1 = 0, r2 = 0, r3 = 0, sum = 0, tempSpeed = 0, ratio = 0;
    for (var i=0;i<N;i++) {
      clone = _.cloneDeep(elements[0]);

      speed = Math.random()*10;


      clone.x = Math.round(Math.random()) == 1 ? 1000 : -1000;
      clone.y = Math.round(Math.random()) == 1 ? 1000 : -1000;
      clone.z = Math.round(Math.random()) == 1 ? 1000 : -1000;

      // randomize speed on each axis
      do {
        r1 = Math.random();
        r2 = Math.random();
        r3 = Math.random();
        sum = r1 + r2 + r3;
      } while (sum === 0);

      // get the real speed on each axis
      speed = speed / Math.sqrt(Math.pow((r1/sum),2)+Math.pow((r2/sum),2)+Math.pow((r3/sum),2));

      clone.vX = (r1/sum)*speed;
      clone.vY = (r2/sum)*speed;
      clone.vZ = (r3/sum)*speed;

      // make it positive or negative
      clone.vX *= Math.round(Math.random()) == 1 ? 1 : -1;
      clone.vY *= Math.round(Math.random()) == 1 ? 1 : -1;
      clone.vZ *= Math.round(Math.random()) == 1 ? 1 : -1;

      clone.x += clone.vX;
      clone.y += clone.vY;
      clone.z += clone.vZ;

      self.elements.push(clone);
    }

    displayer.init(self.elements);
  }
};

module.exports = universe;
