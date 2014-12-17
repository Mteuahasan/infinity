'use strict';

var collider = {
  computeAngle: function(e1, e2, f) {
    var angle = 0;

    // Some operations have been compacted for performances
    angle = (e1.vX*e2.vX + e1.vY*e2.vY + e1.vZ*e2.vZ) /
            Math.sqrt(
              (Math.pow(e1.vX,2) + Math.pow(e1.vY,2) + Math.pow(e1.vZ,2)) *
              (Math.pow(e2.vX,2) + Math.pow(e2.vY,2) + Math.pow(e2.vZ,2)));

    angle = Math.acos(angle) * (180/Math.PI);

    if ((angle < 160 || angle > 200) && f<1) {
      this.bounce(e1, e2);
    }
    else {
      this.merge(e1, e2);
    }
  },

  bounce: function(e1, e2) {
    var deltaM = e1.m - e2.m;
    var sumM   = e1.m + e2.m;

    e1.vX = ((e1.vX * deltaM) + (2 * e2.m * e2.vX)) / sumM;
    e1.vY = ((e1.vY * deltaM) + (2 * e2.m * e2.vY)) / sumM;
    e1.vZ = ((e1.vZ * deltaM) + (2 * e2.m * e2.vZ)) / sumM;

    e2.vX = ((e2.vX * -deltaM) + (2 * e1.m * e1.vX)) / sumM;
    e2.vY = ((e2.vY * -deltaM) + (2 * e1.m * e1.vY)) / sumM;
    e2.vZ = ((e2.vZ * -deltaM) + (2 * e1.m * e1.vZ)) / sumM;
  },

  merge: function(e1, e2) {
    e1.size += e2.size;
    e1.m += e2.m;


    e1.vX = (e1.vX+e2.vX)/2;
    e1.vY = (e1.vY+e2.vY)/2;
    e1.vZ = (e1.vZ+e2.vZ)/2;

    e2.size = 0;
    e2.m = 0;

    e2.vX = 0;
    e2.vY = 0;
    e2.vZ = 0;

    e2.x = 0;
    e2.y = 0;
    e2.z = 0;
  }
};


module.exports = collider;
