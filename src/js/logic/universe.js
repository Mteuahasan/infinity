var _ = require('lodash');

var displayer = require('../ui/displayer');

// Number of elements
var N = 1500;

// Coefficient for initial velocity
var I = .15;

var universe = {
  elements: [],

  init: function(elements) {
    var self = this;
    for (var i=1;i<N;i++) {
      clone = _.cloneDeep(elements[0]);


      // clone.vX = .2*(Math.random()-.5);
      // clone.vY = .2*(Math.random()-.5);
      // clone.vZ = .2*(Math.random()-.5);

      do {
        clone.vX = .5*(Math.random()+2);
        clone.vY = .5*(Math.random()+2);
        clone.vZ = .5*(Math.random()+2);
      } while ((clone.vX + clone.vY + clone.vZ) < .5);

      clone.vX *= Math.round(Math.random()) == 1 ? 1 : -1;
      clone.vY *= Math.round(Math.random()) == 1 ? 1 : -1;
      clone.vZ *= Math.round(Math.random()) == 1 ? 1 : -1;

      self.elements.push(clone);
    }

    displayer.init(self.elements);
  }
};

module.exports = universe;
