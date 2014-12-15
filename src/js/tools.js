var $ = {
  post: function(url, data, cb) {
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onreadystatechange = function() {
      if(this.readyState == this.DONE) {
        if (request.status >= 200 && request.status < 400) {
          if (cb) {
            cb.call(this, JSON.parse(request.response));
          }
          else {
            console.log(JSON.parse(request.response));
          }
        }
        else {
          console.log('An error happened while posting to %s.', url);
        }
      }
    };

    request.send(JSON.stringify(data));
  },

  get: function(url, cb) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        cb.call(this,JSON.parse(request.responseText));
      }
      else {
        console.log('An error happened while getting %s.', url);
      }
    };
    request.onerror = function() {
      console.log('An error happened while getting %s.', url);
    };
    request.send();
  }
};

module.exports = $;
