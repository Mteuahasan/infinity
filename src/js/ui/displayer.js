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

  sphere : null,
  spheres: [],

  init: function(elements) {
    var self = this;

    self.container = document.createElement('div');
    document.body.appendChild(self.container);

    //Setting up the camera
    self.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 1000000000);
    self.camera.position.z = 100;
    self.camera.position.y = 200;

    //Setting up orbit control
    self.controls = new THREE.OrbitControls(self.camera);
    self.controls.addEventListener('change', self.render);

    //Setting up the scene
    self.scene = new THREE.Scene();
    self.setupLights();


    self.scene.add(new THREE.AxisHelper(1000000));
    self.scene.add(new THREE.AxisHelper(-1000000));


    // Render
    self.renderer = new THREE.WebGLRenderer({clearAlpha: 1});
    self.renderer.setSize(window.innerWidth, window.innerHeight);
    self.container.appendChild(self.renderer.domElement);

    // On Resize
    window.addEventListener('resize', self.onWindowResize, false);
    self.animate();


    /**
      * Set spheres
    */
    var sphereGeometry = new THREE.SphereGeometry(0.5, 3, 3);
    var sphereMaterial = new THREE.MeshPhongMaterial({color: 0xffff00});

    self.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);


    self.createSpheresSync(elements, function() {
      var ticker = require('../logic/ticker.js');
      ticker.init();
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
    var ambientLight = new THREE.AmbientLight({color : 0xffffff});
    self.scene.add(ambientLight);
  },

  // Create sphere in a for loop, faster and but freezes the browser
  createSpheresSync: function(elements ,cb) {
    var self = this;
    var sphere = null;
    for (var i=0;i<elements.length;i++) {
      sphere = self.sphere.clone();
      sphere.position.x = elements[i].x;
      sphere.position.y = elements[i].y;
      sphere.position.z = elements[i].z;
      self.scene.add(sphere);
      self.spheres.push(sphere);
      console.log(sphere);
      // self.geo.merge(self.geo, self.sphere);
    }


    // add it to the scene
    // self.scene.add(self.geo);
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
    for (var i=0; i<elements.length; i++) {
      self.spheres[i].position.x = elements[i].x;
      self.spheres[i].position.y = elements[i].y;
      self.spheres[i].position.z = elements[i].z;
    }
    //self.particleSystem.geometry.verticesNeedUpdate = true;
  }
};

module.exports = displayer;
