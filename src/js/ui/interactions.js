'use strict';

var $ = require('../tools');

var interactions = {
  init:function(){
    interactions.masseInteraction();
    interactions.fusionInteraction();
  },
  masseInteraction:function(){
    var masseField = $.byId('value-masse');
    $.byId('param-masse').addEventListener('change',function(){
      masseField.innerHTML = this.value;
      console.log(this.value);
    },false); 
  },
  fusionInteraction:function(){
    var fusionField = $.byId('value-fusion');
    $.byId('param-fusion').addEventListener('change',function(){
      fusionField.innerHTML = this.value;
      console.log(this.value);
    },false); 
  },
  changeMasse: function(masse) {
    for (var i=0; i < elements.length; i++) {
      
    }
  }
  
  
};

module.exports = interactions;