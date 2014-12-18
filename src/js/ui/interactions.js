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
      gravity.massCoef = this.value/gravity.massCoef;
      gravity.massNeedUpdate = true;
    },false);
  },

  fusionInteraction:function() {
    var fusionField = $.byId('value-fusion');
    $.byId('param-fusion').addEventListener('change',function() {
      fusionField.innerHTML = this.value;
      // Call changeFusion
      console.log(this.value);
    },false);
  },

  changeFusion:function(fusion) {
    for (var i=0; i < elements.length; i++) {
      // Apply fusion rate
    }
  }
};

module.exports = interactions;