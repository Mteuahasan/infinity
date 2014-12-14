var collider = {
  computeAngle: function(e1, e2) {
    var angle = 0;

    angle = (e1.x*e2.x + e1.y*e2.y + e1.z*e2.z);;

    angle /= Math.sqrt(e1.x*e1.x + e1.y*e1.y + e1.z*e1.z) *
             Math.sqrt(e2.x*e2.x + e2.y*e2.y + e2.z*e2.z);

    angle = Math.acos(angle);


    //if (angle * (180/Math.PI) >= 90) {
      this.bounce(e1, e2);
    //}
  },

  bounce: function(e1, e2, d) {
    var deltaM = e1.m - e2.m;
    var sumM   = e1.m + e2.m;

    var newVe1X = ((e1.vX * deltaM) + (2 * e2.m * e2.vX)) / sumM;
    var newVe1Y = ((e1.vY * deltaM) + (2 * e2.m * e2.vY)) / sumM;
    var newVe1Z = ((e1.vZ * deltaM) + (2 * e2.m * e2.vZ)) / sumM;

    var newVe2X = ((e2.vX * deltaM) + (2 * e1.m * e1.vX)) / sumM;
    var newVe2Y = ((e2.vY * deltaM) + (2 * e1.m * e1.vY)) / sumM;
    var newVe2Z = ((e2.vZ * deltaM) + (2 * e1.m * e1.vZ)) / sumM;


    e1.vX = newVe1X;
    e1.vY = newVe1Y;
    e1.vZ = newVe1Z;

    e2.vX = newVe2X;
    e2.vY = newVe2Y;
    e2.vZ = newVe2Z;

    // Prevent objects form being stuck together
    e1.x += newVe1X;
    e1.y += newVe1Y;
    e1.z += newVe1Z;
    e2.x += newVe2X;
    e2.y += newVe2Y;
    e2.z += newVe2Z;
  },

  merge: function() {

  }
}


module.exports = collider;
