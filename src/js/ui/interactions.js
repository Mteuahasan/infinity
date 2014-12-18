'use strict';

var $ = require('../tools');

var gravity = require('../logic/gravity');
var collider = require('../logic/collider');

var interactions = {
  init:function() {
    interactions.masseInteraction();
    interactions.fusionInteraction();
    interactions.demarrageSyst();
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
  },
  demarrageSyst:function(){
    var button = $.byId('button-syst');
    var etapes = document.querySelectorAll('.etape');
    var forms = document.querySelectorAll('#popup-box form');
    var popupBox = $.byId('popup-box');
    
    button.addEventListener('click',function(e){ // Click on REDEMARRAGE
      e.preventDefault();
      button.innerHTML="<a href=\"\">[ REDEMARRAGE SYST. ]</a>";
      button.removeEventListener('click');
      popupBox.classList.add('active');
      etapes[0].style.cssText="top:0px;";
    },false);
    
    forms[0].addEventListener('submit',function(e){
      e.preventDefault();
      // SET ETAPE 1 PARAM
      etapes[0].style.cssText="top:101%;";
      setTimeout(function(){etapes[1].style.cssText="top:0;";},1000);
      return;
    },false);
    
    forms[1].addEventListener('submit',function(e){
      e.preventDefault();
      // SET ETAPE 3 PARAM
      etapes[1].style.cssText="top:101%;";
      setTimeout(function(){etapes[2].style.cssText="top:0;"},1000);
      return;
    },false);
    
    forms[2].addEventListener('submit',function(e){
      e.preventDefault();
        // SET ETAPE 3 PARAM
        etapes[2].style.cssText="top:101%;";
        popupBox.classList.remove('active');
      return;
    },false);
    
  }
  
};

module.exports = interactions;