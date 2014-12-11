var _ = require('lodash');

var displayer = require('../ui/displayer');

// Number of elements
var N = 1000;

// Coefficient for initial velocity
var I = 1;

var universe = {
  elements: [],

  init: function(elements) {
    var self = this;
    for (var i=1;i<N;i++) {
      clone = _.cloneDeep(elements[0]);


      clone.vX = (I/10)*Math.random()+I;
      clone.vY = (I/10)*Math.random()+I;
      clone.vZ = (I/10)*Math.random()+I;

      clone.vX *= Math.round(Math.random()) == 1 ? 1 : -1;
      clone.vY *= Math.round(Math.random()) == 1 ? 1 : -1;
      clone.vZ *= Math.round(Math.random()) == 1 ? 1 : -1;

      self.elements.push(clone);
    }

    displayer.init(self.elements);
  }
};

module.exports = universe;
