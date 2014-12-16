var $ = require('../tools');

var informations = {

  startDate : new Date(),
  endDate : '',

  init: function() {
    this.displayTime();
  },


  displayTime: function(){
    var currentTime = $.byId('current_time');
    var timeLaps = $.byId('time');

    setInterval(function(){
      currentTime.innerHTML=informations.getTime();
      var delta = informations.getDateDiff(informations.startDate,informations.endDate);
      timeLaps.innerHTML=delta.hour+':'+delta.min+':'+delta.sec;
    },1000);
  },


  getTime : function(){
      var date = new Date();
      informations.endDate = date;

      var hh = date.getHours();
      var mm = date.getMinutes();
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
  }
};

module.exports = informations;
