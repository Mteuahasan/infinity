'use strict';

var _ = require('lodash');

var displayer = require('../ui/displayer');

// Number of elements

var universe = {
  elements: [],

  init: function(N, m, minSpeed, randSpeed, reset) {
    var self = this;

    self.elements = [];
    // options - default || setted
    N         = N || 2000;
    minSpeed  = minSpeed || .5;
    randSpeed = randSpeed || .5;

    var elementTemplate = {
      type: "elementary",
      size: 2,
      m: m || 1,
      x: 0,
      y: 0,
      z: 0,
      vX: 0,
      vY: 0,
      vZ: 0,
      speed: 0,
      children: []
    };

    var speed = 0;
    var r1 = 0, r2 = 0, r3 = 0, sum = 0, tempSpeed = 0, ratio = 0, clone = null;
    for (var i=0;i<N;i++) {
      clone = _.cloneDeep(elementTemplate);

      speed = Math.random()*randSpeed+minSpeed;


      // randomize speed on each axis
      do {
        r1 = Math.random();
        r2 = Math.random();
        r3 = Math.random();
        sum = r1 + r2 + r3;
      } while (sum < 0.1);

      // get the real speed on each axis
      speed = speed / Math.sqrt(Math.pow((r1/sum),2)+Math.pow((r2/sum),2)+Math.pow((r3/sum),2));

      clone.vX = (r1/sum)*speed * (Math.round(Math.random()) == 1 ? 1 : -1);
      clone.vY = (r2/sum)*speed * (Math.round(Math.random()) == 1 ? 1 : -1);
      clone.vZ = (r3/sum)*speed * (Math.round(Math.random()) == 1 ? 1 : -1);

      clone.x += clone.vX;
      clone.y += clone.vY;
      clone.z += clone.vZ;

      self.elements.push(clone);
    }

    if (reset === true)
      displayer.reset(self.elements);
    else
      displayer.init(self.elements);
  }
};

module.exports = universe;
