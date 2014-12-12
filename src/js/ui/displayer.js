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

    self.container = document.createElement('div');
    document.body.appendChild(self.container);

    //Setting up the camera
    self.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 1000000);
    self.camera.position.z = 100;
    self.camera.position.y = 200;

    //Setting up orbit control
    self.controls = new THREE.OrbitControls(self.camera);
    self.controls.addEventListener('change', self.render);

    //Setting up the scene
    self.scene = new THREE.Scene();
    self.setupLights();

    // Render
    self.renderer = new THREE.WebGLRenderer({clearAlpha: 1});
    self.renderer.setSize(window.innerWidth, window.innerHeight);
    self.container.appendChild(self.renderer.domElement);

    // On Resize
    window.addEventListener('resize', self.onWindowResize, false);
    self.animate();


    /**
      * Set-particles
    */
    self.particles = new THREE.Geometry(),
    self.pMaterial = new THREE.PointCloudMaterial({
      size: 2,
      color: 0xFFFFFF,
      blending: THREE.AdditiveBlending,
      transparent: true,
      program: self.particleRender
    });
    self.pMaterial.programe
    console.log(self.pMaterial)
    self.particle = new THREE.Vector3(0, 0, 0);


    self.createSpheresSync(0, elements, function() {
      var ticker = require('../logic/ticker.js');
      ticker.tick();
    });

    // Set up animation
    var meter = new FPSMeter({
      theme  : 'dark',
      heat   : true,
      graph  : true,
      history: 20
    });
    (function animloop(){
      requestAnimFrame(animloop);
      meter.tick();
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
    // var ambientLight = new THREE.AmbientLight({color : 0xffffff});
    // self.scene.add(ambientLight);
  },

  // Create sphere the recursive way, it takes a longer time
  // but doesn't free the browser
  createSpheresAsync: function(n, elements, cb) {
    var self = this;
    if (n===elements.length) {
      self.particleSystem = new THREE.PointCloud(
          self.particles,
          self.pMaterial);

      self.particleSystem.sortParticles = false;

      // add it to the scene
      self.scene.add(self.particleSystem);
      cb();
      return;
    }

    var particle = self.particle.clone();
    particle.x = elements[n].x;
    particle.y = elements[n].y;
    particle.z = elements[n].z;
    self.particles.vertices.push(particle);
    elements[n].particle = particle;

    setTimeout(function() {
      self.createSpheresAsync(n+1, elements, cb);
    }, 0);
  },

  // Create sphere in a for loop, faster and but freezes the browser
  createSpheresSync: function(n, elements, cb) {
    var self = this;
    for (var i=0;i<elements.length;i++) {
      var particle = self.particle.clone();
      particle.x = elements[i].x;
      particle.y = elements[i].y;
      particle.z = elements[i].z;
      self.particles.vertices.push(particle);
      elements[i].particle = particle;
    }

    self.particleSystem = new THREE.PointCloud(
        self.particles,
        self.pMaterial);

    self.particleSystem.sortParticles = false;

    // add it to the scene
    self.scene.add(self.particleSystem);
    cb();
  },

  onWindowResize: function() {
    displayer.camera.aspect = window.innerWidth / window.innerHeight;
    displayer.camera.updateProjectionMatrix();
    displayer.renderer.setSize(window.innerWidth, window.innerHeight);
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
    for( var i = 0; i < elements.length; i++ ) {
      elements[i].particle.x = elements[i].x;
      elements[i].particle.y = elements[i].y;
      elements[i].particle.z = elements[i].z;
    }
    self.particleSystem.geometry.verticesNeedUpdate = true;
  }
};

module.exports = displayer;
