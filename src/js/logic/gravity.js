var _ = require('lodash');

var universe = require('./universe');

var gravity = {
  // G is multiply by a coefficient to control speed.
  COEF: 1*Math.pow(10, 9),
  G: 6.67384*Math.pow(10, -11)*1*Math.pow(10, 9),

  computeVelocity: function(index) {
    var self = this;
    var e1 = universe.elements[index];

    if (index === universe.elements.length-1) {
      self.computePosition(e1);
      return (universe.elements);
    };

    var e2, d, f, veX, veY, veZ;
    for (var i=index+1;i<universe.elements.length;i++) {
      e2 = universe.elements[i];
      d = self.computeSquareDistance(e1, e2);
      if (d>1) {
        f = self.G*((e1.m*e2.m)/d);

        veX = e2.x - e1.x;
        veY = e2.y - e1.y;
        veZ = e2.z - e1.z;
        // e2 to e1 is -veX, -veY, -veZ

        e1.vX += f*(veX);
        e1.vY += f*(veY);
        e1.vZ += f*(veZ);

        e2.vX += -f*(veX);
        e2.vY += -f*(veY);
        e2.vZ += -f*(veZ);
      }
    }

    self.computePosition(e1);

    // Re-call the function for the next element
    return self.computeVelocity(index+1);
  },

  // Compute the square of the distance between 2 elements
  computeSquareDistance: function(e1, e2) {
    return (e1.x-e2.x)*(e1.x-e2.x)+(e1.y-e2.y)*(e1.y-e2.y)+(e1.z-e2.z)*(e1.z-e2.z);
  },

  // Simply set up the new position of an element
  computePosition: function(element) {
    element.x += element.vX;
    element.y += element.vY;
    element.z += element.vZ;
  }
};


module.exports = gravity;
