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

    if ((angle<177 || angle>183) && f<4) {
      this.bounce(e1, e2);
    }
    else {
      if (f<10)
        this.merge(e1, e2);
      else {
        if (e1.children)
          this.splitChildren(e1);
        if (e2.children)
          this.splitChildren(e2);
      }
    }
  },

  bounce: function(e1, e2) {
    var deltaM = e1.m - e2.m;
    var sumM   = (e1.m + e2.m);

    e1.vX = ((e1.vX * deltaM) + (2 * e2.m * e2.vX)) / sumM;
    e1.vY = ((e1.vY * deltaM) + (2 * e2.m * e2.vY)) / sumM;
    e1.vZ = ((e1.vZ * deltaM) + (2 * e2.m * e2.vZ)) / sumM;

    e2.vX = -((e2.vX * deltaM) + (2 * e1.m * e1.vX)) / sumM;
    e2.vY = -((e2.vY * deltaM) + (2 * e1.m * e1.vY)) / sumM;
    e2.vZ = -((e2.vZ * deltaM) + (2 * e1.m * e1.vZ)) / sumM;

    e1.x += e1.vX*2;
    e1.y += e1.vY*2;
    e1.Z += e1.vZ*2;

    e2.x += e2.vX*2;
    e2.y += e2.vY*2;
    e2.Z += e2.vZ*2;
  },

  merge: function(e1, e2) {
    var sumM = e1.m + e2.m;

    e1.vX = (e1.vX*e1.m+e2.vX*e2.m)/(2*sumM);
    e1.vY = (e1.vY*e1.m+e2.vY*e2.m)/(2*sumM);
    e1.vZ = (e1.vZ*e1.m+e2.vZ*e2.m)/(2*sumM);

    e1.size += e2.size;
    e1.m = sumM;

    e1.children.push(e2);

    e2.size = 0;
    e2.m = 0;

    e2.vX = 0;
    e2.vY = 0;
    e2.vZ = 0;

    e2.x = 0;
    e2.y = 0;
    e2.z = 0;
  },

  splitChildren: function(e) {
    var detlaVX = e.vX/e.children.length;
    var detlaVY = e.vY/e.children.length;
    var detlaVZ = e.vZ/e.children.length;
    for (var i=0; i<e.children.length;i++) {
      e.children[i].m = e.m = e.m/e.children.length;
      e.children[i].s = e.s = e.m;

      e.children[i].x = e.x;
      e.children[i].y = e.y;
      e.children[i].z = e.z;

      e.vX -= detlaVX;
      e.vY -= detlaVY;
      e.vZ -= detlaVZ;

      e.children[i].vX = detlaVX;
      e.children[i].vY = detlaVY;
      e.children[i].vZ = detlaVZ;

      e.x += e.vX;
      e.y += e.vY;
      e.z += e.vZ;

      e.children[i].x += e.children[i].vX;
      e.children[i].y += e.children[i].vY;
      e.children[i].z += e.children[i].vZ;
    }
    e.children = [];
  }
};


module.exports = collider;
