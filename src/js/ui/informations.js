var $ = require('../tools');

var informations = {
  init: function() {
    var startDate = new Date();
    var endDate;


    function theTime(){
      var date = new Date();
      endDate = date;
      var hh = date.getHours();
      var mm = date.getMinutes();
      var ss = date.getSeconds();
      return hh+':'+mm+':'+ss;
    }

    function dateDiff(date1, date2){
        var diff = {}
        var tmp = date2 - date1;

        tmp = Math.floor(tmp/1000);
        diff.sec = tmp % 60;

        tmp = Math.floor((tmp-diff.sec)/60);
        diff.min = tmp % 60;

        tmp = Math.floor((tmp-diff.min)/60);
        diff.hour = tmp % 24;

        tmp = Math.floor((tmp-diff.hour)/24);
        diff.day = tmp;

        return diff;
    }

    var currentTime = $.byId('current_time');
    var timeLaps = $.byId('time');

    setInterval(function(){
      currentTime.innerHTML=theTime();
      var delta = dateDiff(startDate,endDate);
      timeLaps.innerHTML=delta.hour+':'+delta.min+':'+delta.sec;
      //timeLaps.innerHTML=timeLaps(timeLaps.innerHTML);
    },1000);



  }
};

module.exports = informations;
