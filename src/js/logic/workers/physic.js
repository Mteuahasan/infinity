var worker = self;

// Worker can be called and compute new position
worker.addEventListener('message', function(e) {
  elements = e.data.elements;
  gravity.computeVelocity(0, elements, e.data.ticks);
}, false);


/**
  * COMPUTE THE GRAVITY BETWEEN PARTICLES
*/
var gravity = {
  // G is multiply by a coefficient to control speed.
  COEF: Math.pow(10, 9),
  G: 6.67384*Math.pow(10, -11),

  computeVelocity: function(index, elements, ticks) {
    var self = this;
    var e1 = elements[index];
    var e2, d, f, veX, veY, veZ;

    if (index === elements.length-1) {
      self.computePosition(e1);
      worker.postMessage(elements);
      return;
    };
    for (var i=index+1;i<elements.length;i++) {
      e2 = elements[i];
      d = self.computeSquareDistance(e1, e2);
      if (e1.m && e2.m) {
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
        else if (ticks < 3) {
          collider.computeAngle(e1, e2, d);
        }
      }
    }

    self.computePosition(e1);

    //Re-call the function for the next element
    return gravity.computeVelocity(index+1, elements, ticks);
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


/**
  * COMPUTE COLLISION TO HANDLE BOUNCE AND MERGE
*/
var collider = {
  computeAngle: function(e1, e2) {
    var angle = 0;

    angle = (e1.vX*e2.vX + e1.vY*e2.vY + e1.vZ*e2.vZ);
    angle /= Math.sqrt(Math.pow(e1.vX,2) + Math.pow(e1.vY,2) + Math.pow(e1.vZ,2)) *
             Math.sqrt(Math.pow(e2.vX,2) + Math.pow(e2.vY,2) + Math.pow(e2.vZ,2));

    angle = Math.acos(angle);
    angle = angle * (180/Math.PI);
    if (angle  <= 160 || angle >= 200) {
      this.bounce(e1, e2);
    }
    else {
      this.merge(e1, e2);
    }

  },

  bounce: function(e1, e2, d) {
    var deltaM = e1.m - e2.m;
    var sumM   = e1.m + e2.m;

    //console.log('bounce')

    var newVe1X = ((e1.vX * deltaM) + (2 * e2.m * e2.vX)) / sumM;
    var newVe1Y = ((e1.vY * deltaM) + (2 * e2.m * e2.vY)) / sumM;
    var newVe1Z = ((e1.vZ * deltaM) + (2 * e2.m * e2.vZ)) / sumM;

    var newVe2X = ((e2.vX * -deltaM) + (2 * e1.m * e1.vX)) / sumM;
    var newVe2Y = ((e2.vY * -deltaM) + (2 * e1.m * e1.vY)) / sumM;
    var newVe2Z = ((e2.vZ * -deltaM) + (2 * e1.m * e1.vZ)) / sumM;


    e1.vX = newVe1X;
    e1.vY = newVe1Y;
    e1.vZ = newVe1Z;

    e2.vX = newVe2X;
    e2.vY = newVe2Y;
    e2.vZ = newVe2Z;
  },

  merge: function(e1, e2) {
    e1.size += e2.size;
    e1.m += e2.m;

    console.log(e1.m);

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

