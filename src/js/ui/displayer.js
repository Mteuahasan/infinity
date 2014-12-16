var _     = require('lodash');

var $      = require('../tools.js');
var THREE  = require('../libs/orbit-control.js');


var displayer = {
  windowHalfX: window.innerWidth/2,
  windowHalfY: window.innerHeight/2,

  container: null,

  model      : null,
  camera     : null,
  scene      : null,
  renderer   : null,
  helper     : null,
  helperBis  : null,
  showHelpers: false,

  particle      : null,
  particles     : null,
  pMaterial     : null,
  particleSystem: null,

  init: function(elements) {
    var self = this;

    self.container = document.querySelector('#viewport');


    /**
      * RENDER
    */
    self.renderer = new THREE.WebGLRenderer({clearAlpha: 1});
    self.renderer.setSize(self.container.offsetWidth, self.container.offsetHeight);
    self.container.appendChild(self.renderer.domElement);


    //Setting up the camera
    self.camera = new THREE.PerspectiveCamera(55, self.container.offsetWidth / self.container.offsetHeight, 2, 100000000);
    self.camera.position.z = 1000;
    self.camera.position.y = 1000;


    //Setting up the scene
    self.scene = new THREE.Scene();

    self.setupLights();
    self.helper    = new THREE.AxisHelper(1000);
    self.helperBis = new THREE.AxisHelper(-1000);
    self.showHideHelpers();


    //Setting up orbit control
    self.controls = new THREE.OrbitControls(self.camera, self.container, self.container);
    self.controls.addEventListener('change', self.render);



    // On Resize
    window.addEventListener('resize', self.onWindowResize, false);


    /**
    * Set-particles
    */
    var uniforms = {
      color: { type: "c", value: new THREE.Color( 0xff00ff ) },
    };

    var attributes = {
      size: { type: 'f', value: [] },
      colors: { type: 'c', value: []}
    };

    for (var i=0; i < elements.length; i++) {
      attributes.colors.value.push(new THREE.Color( 0xcccccc ));
      attributes.size.value.push(Math.random()*10);
    }

    attributes.colors.value[6] = new THREE.Color(0x00ff00);
    attributes.colors.value[7] = new THREE.Color(0x0000ff);
    attributes.colors.value[8] = new THREE.Color(0xffff00);
    attributes.colors.value[9] = new THREE.Color(0xff0000);

    self.particles = new THREE.Geometry();
    self.pMaterial = new THREE.ShaderMaterial({
     uniforms: uniforms,
     attributes: attributes,
     vertexShader: document.getElementById('vertShader').textContent,
     fragmentShader: document.getElementById('fragShader').textContent
    });

    self.particle = new THREE.Vector3(0, 0, 0);

    self.createSpheresSync(0, elements, function() {
      var ticker = require('../logic/ticker.js');
      ticker.init();
    });


    /**
      * RAF main anim loop
    */
    // Set up fps meter
    self.meter = new FPSMeter({
      theme  : 'dark',
      heat   : true,
      graph  : true,
      history: 20
    });

    (function animLoop() {
      self.render();
      self.animate();
      self.meter.tick();
      requestAnimFrame(animLoop);
    })();
  },

  showHideHelpers: function() {
    var self = this;
    self.showHelpers = !self.showHelpers;
    if (self.showHelpers) {
      self.scene.add(self.helper);
      self.scene.add(self.helperBis);
    }
    else {
      self.scene.remove(self.helper);
      self.scene.remove(self.helperBis);
    }
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
    displayer.controls.update();
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
