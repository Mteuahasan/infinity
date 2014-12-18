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

      // RESET
      button.innerHTML="<a href=\"\">[ REDEMARRAGE SYST. ]</a>";
      button.removeEventListener('click');
      popupBox.classList.add('active');
      steps[0].style.cssText="top:0px;";
    },false);

    forms[0].addEventListener('submit',function(e) {
      e.preventDefault();

      // SET STEP 1 PARAM
      steps[0].style.cssText="top:101%;";
      setTimeout(function() {steps[1].style.cssText="top:0;";},1000);
      return;
    },false);

    forms[1].addEventListener('submit',function(e) {
      e.preventDefault();

      // SET STEP 2 PARAM
      steps[1].style.cssText="top:101%;";
      setTimeout(function() {steps[2].style.cssText="top:0;"},1000);
      return;
    },false);

    forms[2].addEventListener('submit',function(e) {
      e.preventDefault();

        // SET STEP 3 PARAM
        // Start
        steps[2].style.cssText="top:101%;";
        popupBox.classList.remove('active');
        setTimeout(function() {
          // Pause
          popupBox.classList.add('active');
          steps[3].style.cssText="top:0;";
        },20000);
      return;
    },false);

    $.byId('final-close').addEventListener('click',function(e) {
      e.preventDefault();
      popupBox.classList.remove('active');
      steps[3].style.cssText="top:101%;";

      // Start
      return;
    },false);
  }

};

module.exports = interactions;