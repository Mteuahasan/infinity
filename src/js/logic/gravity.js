var collider = require('./collider');

/**
  * COMPUTE THE GRAVITY BETWEEN PARTICLES
*/
var gravity = {
  // G is multiply by a coefficient to control speed.
  G: 6.67384*Math.pow(10, -11)*Math.pow(10, 9),

  computeVelocity: function(index, elements, ticks) {
    var self = this;

    var e1 = elements[index];

    // Exit this recursive function
    if (index === elements.length-1) {
      // Still need to update the last element
      e1.x += e1.vX;
      e1.y += e1.vY;
      e1.z += e1.vZ;
      return elements;
    };

    var e2, d, f, deltaVel;

    for (var i=index+1;i<elements.length;i++) {
      e2 = elements[i];

      if (e1.m && e2.m) {
        // Some operations have been compacted for performances
        // d is the square distance between e1 and e2
        d = Math.pow((e1.x-e2.x),2)+Math.pow((e1.y-e2.y),2)+Math.pow((e1.z-e2.z),2);

        if (d > (e1.size + e2.size)) {

          f = self.G*((e1.m*e2.m)/d);

          // Set-up the new new velocity on x for e1 and e2
          deltaVel = e2.x - e1.x;
          deltaVel = f*(deltaVel);
          e1.vX += deltaVel;
          e2.vX += -deltaVel;

          // Set-up the new new velocity on y for e1 and e2
          deltaVel = e2.y - e1.y;
          deltaVel = f*(deltaVel);
          e1.vY += deltaVel;
          e2.vY += -deltaVel;

          // Set-up the new new velocity on z for e1 and e2
          deltaVel = e2.z - e1.z;
          deltaVel = f*(deltaVel);
          e1.vZ += deltaVel;
          e2.vZ += -deltaVel;
        }
        else {
          collider.computeAngle(e1, e2);
        }
      }
    }

    // Set up the current element position
    e1.x += e1.vX;
    e1.y += e1.vY;
    e1.z += e1.vZ;

    //Re-call the function for the next element
    return gravity.computeVelocity(index+1, elements, ticks);
  }
};

module.exports = gravity;
