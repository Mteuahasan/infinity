var $ = require('./tools.js');
var _ = require('lodash');

document.addEventListener('DOMContentLoaded', function() {

  console.log('hello');
  $.get('/data.json', function(d) {
    var elements = d.elements;

    for (var i=1;i<10;i++) {
      clone = _.cloneDeep(elements[0]);
      clone.pX = 10 * (Math.random() - .5);
      clone.pY = 10 * (Math.random() - .5);
      clone.pZ = 10 * (Math.random() - .5);
      elements.push(clone);
    }
    console.log(elements);
  });
});