// Worker can be called and compute new position
self.addEventListener('message', function(e) {
  elements = e.data;
  elements = gravity.computeVelocity(0, elements);
  self.postMessage(elements);
}, false);

var gravity = {
  // G is multiply by a coefficient to control speed.
  COEF: Math.pow(10, 9),
  G: 6.67384*Math.pow(10, -11),

  computeVelocity: function(index, elements) {
    var self = this;
    var e1 = elements[index];
    var e2, d, f, veX, veY, veZ;

    if (index === elements.length-1) {
      self.computePosition(e1);
      return (elements);
    };

    for (var i=index+1;i<elements.length;i++) {
      e2 = elements[i];
      d = self.computeSquareDistance(e1, e2);
      if (d > (e1.size + e2.size)) {
        f = self.G*((e1.m*e2.m)/d);

        veX = e2.x - e1.x;
        veY = e2.y - e1.y;
        veZ = e2.z - e1.z;

        e1.vX += f*(veX)*self.COEF;
        e1.vY += f*(veY)*self.COEF;
        e1.vZ += f*(veZ)*self.COEF;

        e2.vX += -f*(veX)*self.COEF;
        e2.vY += -f*(veY)*self.COEF;
        e2.vZ += -f*(veZ)*self.COEF;
      }
      else {
        collider.computeAngle(e1, e2, d);
      }
    }

    self.computePosition(e1);

    // Re-call the function for the next element
    return self.computeVelocity(index+1, elements);
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
};

