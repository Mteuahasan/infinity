'use strict';

var $ = require('../tools');

var gravity = require('../logic/gravity');
var collider = require('../logic/collider');

var interactions = {
  init:function() {
    interactions.masseInteraction();
    interactions.fusionInteraction();
  },

  masseInteraction:function() {
    var massField = $.byId('value-mass');
    $.byId('param-mass').addEventListener('input',function() {
      massField.innerHTML = this.value;
      // Tell gravity to update masses of all particles
      gravity.massCoef = this.value/gravity.massCoef;
      gravity.massNeedUpdate = true;
    },false);
  },

  fusionInteraction:function() {
    var fusionField = $.byId('value-fusion');
    $.byId('param-fusion').addEventListener('input',function() {
      fusionField.innerHTML = this.value;
      // Update the collider
      collider.minBounceAngle = 177 - this.value;
      collider.maxBounceAngle = 183 + this.value;
    },false);
  }
};

module.exports = interactions;