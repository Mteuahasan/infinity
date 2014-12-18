'use strict';

var $ = require('../tools');

var gravity = require('../logic/gravity');
var collider = require('../logic/collider');

var interactions = {
  init:function() {
    interactions.masseInteraction();
    interactions.fusionInteraction();
    interactions.startSystem();
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

  },


  startSystem:function() {
    var button = $.byId('button-syst');
    var steps = document.querySelectorAll('.step');
    var forms = document.querySelectorAll('#popup-box form');
    var popupBox = $.byId('popup-box');

    button.addEventListener('click',function(e) {
      e.preventDefault();
      button.removeEventListener('click');

      // RESET
      button.innerHTML="<a href=\"\">[ REDEMARRAGE SYST. ]</a>";
      button.removeEventListener('click');
      popupBox.classList.add('active');
      steps[0].classList.add('active');
    },false);

    var particules = 1;
    $.byId('popup-particules-range').addEventListener('input',function() {
      $.byId('popup-particules').innerHTML = this.value;
      particules = this.value;
    },false);
    
    var masse = 1;
    $.byId('popup-masse-range').addEventListener('input',function() {
      $.byId('popup-masse').innerHTML = this.value;
      masse = this.value;
    },false);
    
    var fusion = 1;
    $.byId('popup-fusion-range').addEventListener('input',function() {
      $.byId('popup-fusion').innerHTML = this.value;
      fusion = this.value;
    },false);
    
    
    
    
    forms[0].addEventListener('submit',function(e) {
      e.preventDefault();

      // SET STEP 1 PARAM
      
      steps[0].classList.remove('active');
      setTimeout(function() {steps[1].classList.add('active');},1000);
      return;
    },false);

    forms[1].addEventListener('submit',function(e) {
      e.preventDefault();

      // SET STEP 2 PARAM
      steps[1].classList.remove('active');
      setTimeout(function() {steps[2].classList.add('active');},1000);
      return;
    },false);

    forms[2].addEventListener('submit',function(e) {
      e.preventDefault();

        // SET STEP 3 PARAM
        // Start
        steps[2].classList.remove('active');
        popupBox.classList.remove('active');
        setTimeout(function() {
          // Pause
          popupBox.classList.add('active');
          steps[3].classList.add('active');
        },20000);
      return;
    },false);

    $.byId('final-close').addEventListener('click',function(e) {
      e.preventDefault();
      popupBox.classList.remove('active');
      steps[3].classList.remove('active');
      // Start
      return;
    },false);
  }

};

module.exports = interactions;