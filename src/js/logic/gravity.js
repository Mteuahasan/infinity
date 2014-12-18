'use strict';

var _ = require('lodash');

var collider = require('./collider');

/**
  * COMPUTE THE GRAVITY BETWEEN PARTICLES
*/
var gravity = {
  // G is multiply by a coefficient to control speed.
  G: 6.67384*Math.pow(10, -11)*Math.pow(10, 8),

  // mass operation
  massNeedUpdate: false,
  massCoef: 1,

  computeVelocity: function(index, elements, ticks, speeds) {
    var self = this;
    speeds = speeds || [];
    var e1 = elements[index];

    // Exit this recursive function
    if (index === elements.length-1) {
      // Do not re-update the masses at next tick
      if (self.massNeedUpdate) {
        e1.m *= self.massCoef;
        self.massNeedUpdate = false;
      }

      // Get the average speed
      var sum = _.reduce(speeds, function(sum, num) {
        return sum + num;
      });

      var average = sum/speeds.length;
      // Still need to update the last element
      e1.x += e1.vX;
      e1.y += e1.vY;
      e1.z += e1.vZ;
      return {elements: elements, speed: average};
    };
    var e2, d, f, deltaVel;
    if (e1.m) {
      for (var i=index+1;i<elements.length;i++) {
        e2 = elements[i];

        if (e2.m) {
          // Some operations have been compacted for performances
          // d is the square distance between e1 and e2
          d = Math.pow((e1.x-e2.x),2)+Math.pow((e1.y-e2.y),2)+Math.pow((e1.z-e2.z),2);

          if (d/2 > (e1.size + e2.size)) {
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
          else if (ticks>10) {
            collider.computeAngle(e1, e2, f);
          }
        }
      }

      // Set up the current element position
      e1.x += e1.vX;
      e1.y += e1.vY;
      e1.z += e1.vZ;


      /**
        * Update the mass of e1
      */
      if (self.massNeedUpdate) {
        e1.m *= self.massCoef;
      }


      /**
        * Compute the speed and save it to compute the average
      */
      e1.speed = Math.sqrt(Math.pow((e1.vX),2)+Math.pow((e1.vY),2)+Math.pow((e1.vZ),2));
      speeds.push(e1.speed);
    }

    //Re-call the function for the next element
    return gravity.computeVelocity(index+1, elements, ticks, speeds);
  }
};

module.exports = gravity;
