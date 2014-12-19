'use strict';

var $ = require('../tools');

var gravity  = require('../logic/gravity');
var collider = require('../logic/collider');
var ticker   = require('../logic/ticker');
var universe = require('../logic/universe');


var interactions = {
  nbOfParticules: 1000,
  mass: 1,
  exploMin: 1,
  expoRand: 1,

  init:function() {
    interactions.massInteraction();
    interactions.fusionInteraction();
    interactions.startSystem();
  },

  massInteraction:function() {
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


  startSystem: function() {
    var self = this;

    var $button = $.byId('button-syst');
    var $steps = document.querySelectorAll('.step');
    var $forms = document.querySelectorAll('#popup-box form');
    var $popupBox = $.byId('popup-box');

    $button.addEventListener('click',function(e) {
      e.preventDefault();
      ticker.run = false;

      $button.classList.add('hide');
      if ($.sel('.step.active'))
        $.sel('.step.active').classList.remove('active');

      $button.innerHTML="<a href=\"\">[ REDEMARRAGE SYST. ]</a>";
      $popupBox.classList.add('active');
      $steps[0].classList.add('active');
    },false);


    $.byId('popup-particules-range').addEventListener('input',function() {
      $.byId('popup-particules').innerHTML = this.value;
      self.nbOfParticules = this.value;
    },false);

    $.byId('popup-mass-range').addEventListener('input',function() {
      $.byId('popup-mass').innerHTML = this.value;
      self.mass = this.value;
    },false);

    $.byId('explosion-min-range').addEventListener('input',function() {
      $.byId('explosion-min').innerHTML = this.value;
      self.exploMin = this.value;
    },false);


    $.byId('explosion-max-range').addEventListener('input',function() {
      $.byId('explosion-max').innerHTML = this.value;
      self.exploRand = this.value;
    },false);


    $forms[0].addEventListener('submit',function(e) {
      e.preventDefault();
      // SET STEP 1 PARAM
      $steps[0].classList.remove('active');
      setTimeout(function() {$steps[1].classList.add('active');},500);
      return;
    },false);

    $forms[1].addEventListener('submit',function(e) {
      e.preventDefault();
      // SET STEP 2 PARAM
      $steps[1].classList.remove('active');
      setTimeout(function() {$steps[2].classList.add('active');},500);
      return;
    },false);

    $forms[2].addEventListener('submit',function(e) {
      e.preventDefault();
      // SET STEP 3 PARAM
      universe.init(self.nbOfParticules,
                    self.mass,
                    self.exploMin,
                    self.exploRand,
                    true);

      $steps[2].classList.remove('active');
      $popupBox.classList.remove('active');
      $button.classList.remove('hide');
      setTimeout(function() {
        if (!$.sel('.step.active')) {
          ticker.run = false;

          $popupBox.classList.add('active');
          $steps[3].classList.add('active');
        }
      }, 20000);
      return;
    },false);

    $.byId('final-close').addEventListener('click',function(e) {
      e.preventDefault();
      $popupBox.classList.remove('active');
      $steps[3].classList.remove('active');
      ticker.run = true;
      ticker.tick();
      return;
    },false);
  }

};

module.exports = interactions;
