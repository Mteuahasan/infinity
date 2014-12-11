var $ = require('./tools.js');
var _ = require('lodash');

var THREE = require('./lib/orbit-control.js');

var G = 6.67384*Math.pow(10, -11);
var COEF = 1000;

var elements;
document.addEventListener('DOMContentLoaded', function() {
  $.get('/data.json', function(d) {
    elements = d.elements;

    for (var i=1;i<2;i++) {
      clone = _.cloneDeep(elements[0]);
      clone.x = 10*(Math.random()-.5);
      clone.y = 10*(Math.random()-.5);
      clone.z = 10*(Math.random()-.5);
      elements.push(clone);
    }
    console.log(elements);

    tick();
  });
});

function tick() {
  var start = Date.now();

  computeVelocity(0);

  var delta = Date.now() - start;
  setTimeout(tick, 200-delta);
}

function computeVelocity(index) {
  var e1 = elements[index];
  if (index === elements.length-1) {
    computePosition(e1);
    return;
  };

  var e2, d, f, veX, veY, veZ, fX, fY, fZ;
  for (var i=index+1;i<elements.length;i++) {
    e2 = elements[i];
    d = computeDistance(e1, e2);
    f = G*(e1.m*e2.m/(d*d));

    // from e1 to e2
    veX = e1.x - e2.x;
    veY = e1.y - e2.y;
    veZ = e1.z - e2.z;
    // e2 to e1 is -veX, -veY, -veZ


    e1.vX += f*(-veX)*COEF;
    e1.vY += f*(-veY)*COEF;
    e1.vZ += f*(-veZ)*COEF;

    e2.vX += f*(veX)*COEF;
    e2.vY += f*(veY)*COEF;
    e2.vZ += f*(veZ)*COEF;
  }
  computePosition(e1);

  computeVelocity(index+1);
}

function computeDistance(e1, e2) {
  return Math.sqrt((e1.x-e2.x)*(e1.x-e2.x)+(e1.y-e2.y)*(e1.y-e2.y)+(e1.z-e2.z)*(e1.z-e2.z));
}

function computePosition(element) {
  element.x += element.vX;
  element.y += element.vY;
  element.z += element.vZ;
  console.log(element.x);
}


function display() {

}
