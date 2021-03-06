'use strict';

var _     = require('lodash');

var $      = require('../tools.js');
var THREE  = require('../libs/orbit-control.js');
var resize = require('../libs/resize.js');


var displayer = {
  windowHalfX: window.innerWidth/2,
  windowHalfY: window.innerHeight/2,

  container: document.querySelector('#viewport'),

  scene      : new THREE.Scene(),
  renderer   : new THREE.WebGLRenderer({clearAlpha: 1}),
  helper     : new THREE.AxisHelper(1000),
  helperBis  : new THREE.AxisHelper(-1000),
  model      : null,
  camera     : null,
  attributes : null,
  showHelpers: true,

  particle      : new THREE.Vector3(0, 0, 0),
  particles     : new THREE.Geometry(),
  pMaterial     : null,
  particleSystem: null,

  canvas : null,
  context: null,
  texture: null,

  init: function(elements) {
    var self = this;

    // Set up fps meter
    self.meter = new FPSMeter({
      theme  : 'dark',
      heat   : true,
      graph  : true,
      history: 20
    });

    /**
      * RENDER
    */
    self.renderer.setSize(self.container.offsetWidth, self.container.offsetHeight);
    self.container.appendChild(self.renderer.domElement);


    //Setting up the camera
    self.camera = new THREE.PerspectiveCamera(55, self.container.offsetWidth / self.container.offsetHeight, 1, 100000000);
    self.camera.position.z = 1000;
    self.camera.position.y = 1000;

    self.showHideHelpers();


    // Setting up orbit control
    self.controls = new THREE.OrbitControls(self.camera, self.container, self.container);
    self.controls.addEventListener('change', self.render);

    // On Resize using the js/libs/resize.js
    addResizeListener(self.container, self.onWindowResize);


    //Draw canvas
    self.createCanvasTexture();
    //Create texture
    self.texture = new THREE.Texture(self.canvas);

    self.texture.needsUpdate = true;

    /**
    * Set-particles
    */
    var uniforms = {
      color: { type: 'c', value: new THREE.Color(0xff00ff) },
      texture: { type: 't', value: self.texture }
    };

    self.attributes = {
      size: { type: 'f', value: [] },
      colors: { type: 'c', value: []}
    };

    for (var i=0; i < elements.length; i++) {
      self.attributes.colors.value.push(new THREE.Color(0xcccccc));
      self.attributes.size.value.push(1);
    }

    self.pMaterial = new THREE.ShaderMaterial({
      uniforms      : uniforms,
      attributes    : self.attributes,
      transparent   : true,
      depthTest     : false,
      depthWrite    : false,
      blending      : "AdditiveBlending",
      vertexShader  : document.getElementById('vertShader').textContent,
      fragmentShader: document.getElementById('fragShader').textContent
    });


    self.createSpheresSync(elements, function() {
      var ticker = require('../logic/ticker.js');
      ticker.init();
    });


    /**
      * RAF main anim loop
    */
    (function animLoop() {
      self.render();
      self.animate();
      self.meter.tick();
      requestAnimFrame(animLoop);
    })();
  },

  reset: function(elements) {
    console.log("reset");
    this.particleSystem =  null;
    this.particles      =  new THREE.Geometry();
    this.scene          =  new THREE.Scene(),
    this.createSpheresSync(elements, function() {
      var ticker = require('../logic/ticker.js');
      ticker.run = true;
      ticker.tick();
    });
  },

  showHideHelpers: function() {
    var self = this;
    self.showHelpers = !self.showHelpers;
    if (self.showHelpers) {
      self.scene.add(self.helper);
      self.scene.add(self.helperBis);
      self.meter.show();
    }
    else {
      self.scene.remove(self.helper);
      self.scene.remove(self.helperBis);
      self.meter.hide();
    }
  },


  // Create sphere in a for loop, faster and but freezes the browser
  createSpheresSync: function(elements ,cb) {
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
  updatePositions: function(elements) {
    var self = this;
    for (var i=0; i<elements.length; i++) {
      self.attributes.size.value[i] = elements[i].size;
      self.particles.vertices[i].x = elements[i].x;
      self.particles.vertices[i].y = elements[i].y;
      self.particles.vertices[i].z = elements[i].z;
    }
    self.particleSystem.geometry.verticesNeedUpdate = true;
    self.attributes.size.needsUpdate = true;
  },

  createCanvasTexture : function() {
    var self = this;

    self.canvas  = document.createElement('canvas');
    self.context = self.canvas.getContext('2d');

    self.canvas.width  = 1000;
    self.canvas.height = self.canvas.width;

    var center = Math.round(self.canvas.width) * 0.5;

    // Preview
    //self.context.clearRect(0, 0, 50, 50);
    self.context.fillStyle   = "#fff";
    self.context.shadowColor = "#ffff00";
    self.context.shadowBlur  = Math.round((self.canvas.width) * 0.1);
    self.context.beginPath();
    self.context.arc(center, center, self.canvas.width * 0.1 * 0.5, 0, Math.PI * 2);
    self.context.fill();

    document.body.appendChild(self.canvas);
  }
};

module.exports = displayer;
