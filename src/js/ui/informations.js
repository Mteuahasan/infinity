'use strict';

var $ = require('../tools');
var informations = {

  startDate : new Date(),
  endDate : '',

  $averageSpeed: $.byId('average-speed'),
  $infosMass   : $.sel('.infos_mass'),
  $infosFusion : $.sel('.infos_fusion'),

  init: function() {
    this.displayTime();
    this.setEvents();
    this.particle();
  },

  hideLoader : function(){
    var loader = $.byId('loader');
    loader.className = 'hide';
    setTimeout(function(){
     loader.remove();
    },1000);
    var ticker = require('../logic/ticker');
    ticker.tick();
  },

  setEvents: function() {
    var controlBar = $.byId('control-bar');
    $.byId('hide').addEventListener('click', function() {
      if (controlBar.classList.contains('hidden')) {
        $.byId('control-bar').classList.remove('hidden');
      }
      else {
        $.byId('control-bar').classList.add('hidden');
      }
    });
    $.sel('.btn-start').addEventListener('click', this.hideLoader, false);
    $.sel('.mass').addEventListener('click', this.showHideMassInfo, false);
    $.sel('.fusion').addEventListener('click', this.showHideFusionInfo, false);
    $.sel('.infos_mass .close').addEventListener('click', this.showHideMassInfo, false);
    $.sel('.infos_fusion .close').addEventListener('click', this.showHideFusionInfo, false);
  },

  displayTime: function() {
    var currentTime = $.byId('current_time');
    var timeLaps = $.byId('time');

    setInterval(function(){
      currentTime.innerHTML=informations.getTime();
      var delta = informations.getDateDiff(informations.startDate,informations.endDate);
      timeLaps.innerHTML=delta.hour+':'+delta.min+':'+delta.sec;
    },1000);
  },

  showHideMassInfo : function() {
    if(informations.$infosMass.classList.contains('hide')) {
        informations.$infosMass.classList.remove("hide");
        informations.$infosFusion.classList.add("hide");
    }else{
        informations.$infosMass.classList.add("hide");
    }
  },

  showHideFusionInfo : function() {
    if(informations.$infosFusion.classList.contains('hide')) {
        informations.$infosFusion.classList.remove("hide");
        informations.$infosMass.classList.add("hide");
    }else{
        informations.$infosFusion.classList.add("hide");
    }
  },

  getTime : function(){
    var date = new Date();
    informations.endDate = date;

    var hh = date.getHours()<10?'0'+date.getHours():date.getHours();
    var mm = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
    var ss = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
    return hh+':'+mm+':'+ss;
  },

  getDateDiff : function(date1, date2){
    var diff = {}
    var tmp = date2 - date1;

    tmp = Math.floor(tmp/1000);
    diff.sec = tmp % 60<10?'0'+tmp % 60:tmp % 60;

    tmp = Math.floor((tmp-diff.sec)/60);
    diff.min = tmp % 60<10?'0'+tmp % 60:tmp % 60;

    tmp = Math.floor((tmp-diff.min)/60);
    diff.hour = tmp % 24<10?'0'+tmp % 24:tmp % 24;

    tmp = Math.floor((tmp-diff.hour)/24);
    diff.day = tmp;

    return diff;
  },

  updateSpeed: function(speed) {
    this.$averageSpeed.innerHTML = speed.toFixed(4);
  },

  particle: function(){

    particlesJS('particles-js', {
      particles: {
        color: '#fff',
        shape: 'circle',
        opacity: 0.5,
        size: 2,
        size_random: true,
        nb: 150,
        line_linked: {
          enable_auto: true,
          distance: 100,
          color: '#fff',
          opacity: 0.5,
          width: 0.3,
          condensed_mode: {
            enable: false,
            rotateX: 600,
            rotateY: 600
          }
        },
        anim: {
          enable: true,
          speed: 1
        }
      },
      interactivity: {
        enable: true,
        mouse: {
          distance: 250
        },
        detect_on: 'canvas',
        mode: 'grab',
        line_linked: {
          opacity: .5
        },
        events: {
          onclick: {
            enable: false,
            mode: 'push',
            nb: 4
          }
        }
      },
      retina_detect: true
    });
  }
};

module.exports = informations;
