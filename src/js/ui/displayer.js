var _     = require('lodash');

var $      = require('../tools.js');
var THREE  = require('../libs/orbit-control.js');


var displayer = {
  windowHalfX: window.innerWidth/2,
  windowHalfY: window.innerHeight/2,

  container: null,

  model   : null,
  camera  : null,
  scene   : null,
  renderer: null,

  particle      : null,
  particles     : null,
  pMaterial     : null,
  particleSystem: null,

  init: function(elements) {
    var self = this;

    self.container = document.querySelector('#viewport');

    //Setting up the camera
    self.camera = new THREE.PerspectiveCamera(55, self.container.offsetWidth / self.container.offsetHeight, 2, 1000000000);
    self.camera.position.z = 1000;
    self.camera.position.y = 1000;

    //Setting up orbit control
    self.controls = new THREE.OrbitControls(self.camera, self.container, self.container);
    self.controls.addEventListener('change', self.render);

    //Setting up the scene
    self.scene = new THREE.Scene();
    self.setupLights();


    self.scene.add(new THREE.AxisHelper(1000000));
    self.scene.add(new THREE.AxisHelper(-1000000));


    // Render
    self.renderer = new THREE.WebGLRenderer({clearAlpha: 1});
    self.renderer.setSize(self.container.offsetWidth, self.container.offsetHeight);
    self.container.appendChild(self.renderer.domElement);

    // On Resize
    window.addEventListener('resize', self.onWindowResize, false);
    self.animate();


    /**
    * Set-particles
    */
    self.particles = new THREE.Geometry();
    self.pMaterial = new THREE.PointCloudMaterial({
      size: 2,
      color: 0xFFFFFF
    });

    self.particle = new THREE.Vector3(0, 0, 0);

    self.createSpheresSync(0, elements, function() {
      var ticker = require('../logic/ticker.js');
      ticker.init();
    });

    // Set up animation
    self.meter = new FPSMeter({
      theme  : 'dark',
      heat   : true,
      graph  : true,
      history: 20
    });
    (function animloop(){
      requestAnimFrame(animloop);
      self.meter.tick();
      self.render();
    })();
  },

  particleRender: function(ctx) {
    ctx.beginPath();
    ctx.arc( 0, 0, 1, 0,  Math.PI * 2, true );
    ctx.fill();
  },

  setupLights: function() {
    var self = this;

    // Ambient Light
    var ambientLight = new THREE.AmbientLight({color : 0xffffff});
    self.scene.add(ambientLight);
  },

  // Create sphere in a for loop, faster and but freezes the browser
  createSpheresSync: function(n, elements ,cb) {
    var self = this;
    var particle = null;
    for (var i=0;i<elements.length;i++) {
      particle = self.particle.clone();

      particle.setX(elements[i].x)
              .setY(elements[i].y)
              .setZ(elements[i].z);

      elements[i].particle = particle;
      self.particles.vertices.push(particle);
    }

    self.particleSystem = new THREE.PointCloud(
      self.particles,
      self.pMaterial
    );

    self.particleSystem.sortParticles = false;

    // add it to the scene
    self.scene.add(self.particleSystem);
    cb();
  },

  onWindowResize: function() {
    displayer.camera.aspect = displayer.container.offsetWidth / displayer.container.offsetHeight;
    displayer.camera.updateProjectionMatrix();
    displayer.renderer.setSize(displayer.container.offsetWidth, displayer.container.offsetHeight);
  },

  animate: function() {
    requestAnimationFrame(displayer.animate);
    displayer.controls.update();
    displayer.render();
  },


  // Render the scene
  render: function() {
    displayer.camera.lookAt(displayer.scene.position);
    displayer.renderer.render(displayer.scene, displayer.camera);
  },


  // Called at every ticks to move the elements
  updatePosition: function(elements) {
    var self = this;
    for (var i=0; i<elements.length; i++) {
      self.particles.vertices[i].x = elements[i].x;
      self.particles.vertices[i].y = elements[i].y;
      self.particles.vertices[i].z = elements[i].z;
    }
    self.particleSystem.geometry.verticesNeedUpdate = true;
  }
};

module.exports = displayer;
