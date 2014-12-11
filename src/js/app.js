var $ = require('./tools.js');
var _ = require('lodash');

var THREE = require('./lib/orbit-control.js');

var G = 6.67384*Math.pow(10, -11);
var COEF = 100000;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var container;
var camera, scene, renderer, geometry, material, i, h, size, counter, spheres = [];

var elements;
document.addEventListener('DOMContentLoaded', function() {

  $.get('/data.json', function(d) {
    elements = d.elements;

    for (var i=1;i<10;i++) {
      clone = _.cloneDeep(elements[0]);
      clone.x = 10*(Math.random()-.5);
      clone.y = 10*(Math.random()-.5);
      clone.z = 10*(Math.random()-.5);
      elements.push(clone);
    }
    console.log(elements);

    initRender();
  });
});

function tick() {
  var start = Date.now();

  computeVelocity(0);
  display();

  var delta = Date.now() - start;
  setTimeout(tick, 20-delta);
}

function computeVelocity(index) {
  var e1 = elements[index];
  if (index === elements.length-1) {
    computePosition(e1);
    return;
  };

  var e2, d, f, veX, veY, veZ, fX, fY, fZ;
  for (var i=index+1;i<elements.length;i++) {
    e2 = elements[i];
    d = computeDistance(e1, e2);
    f = G*(e1.m*e2.m/(d*d));

    // from e1 to e2
    veX = e1.x - e2.x;
    veY = e1.y - e2.y;
    veZ = e1.z - e2.z;
    // e2 to e1 is -veX, -veY, -veZ


    e1.vX += f*(-veX)*COEF;
    e1.vY += f*(-veY)*COEF;
    e1.vZ += f*(-veZ)*COEF;

    e2.vX += f*(veX)*COEF;
    e2.vY += f*(veY)*COEF;
    e2.vZ += f*(veZ)*COEF;
  }
  computePosition(e1);

  computeVelocity(index+1);
}

function computeDistance(e1, e2) {
  return Math.sqrt((e1.x-e2.x)*(e1.x-e2.x)+(e1.y-e2.y)*(e1.y-e2.y)+(e1.z-e2.z)*(e1.z-e2.z));
}

function computePosition(element) {
  element.x += element.vX;
  element.y += element.vY;
  element.z += element.vZ;
  console.log(element.x);
}


function display() {
  for( var i = 0; i < spheres.length; i++ ) {
    spheres[i].position.x = elements[i].x;
    spheres[i].position.y = elements[i].y;
    spheres[i].position.z = elements[i].z;
  }
}

function initRender() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  //Setting up the camera
  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000 );
  camera.position.z = 100;
  camera.position.y = 200;

  //Setting up orbit control
  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', render );

  //Setting up the scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x000000, 0.002 );

  //Create spheres
  createSpheres(0);

  //Setting up the light
  createLights();

  //Render

  renderer = new THREE.WebGLRenderer( { clearAlpha: 1 } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  // On Resize

  window.addEventListener( 'resize', onWindowResize, false );
  animate();
}

function createLights() {
  //Spotlight
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 200, 0 );

  spotLight.castShadow = true;

  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;

  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;

  scene.add( spotLight );

  //Ambientlight
  var ambientLight = new THREE.AmbientLight({ color : 0xffffff });
  scene.add( ambientLight );
}

// Create spheres
function createSpheres(n) {
  if (n===elements.length) {
    tick();
    return;
  };

  geometry = new THREE.SphereGeometry( .5, 3, 3 );
  material = new THREE.MeshPhongMaterial( {color: 0xffff00} );
  sphere = new THREE.Mesh( geometry, material );
  console.log(n);
  sphere.position.x = elements[n].x;
  sphere.position.y = elements[n].y;
  sphere.position.z = elements[n].z;
  scene.add( sphere );
  spheres.push( sphere );

  setTimeout(function() {
    createSpheres(n+1);
  }, 1);


}

// Events functions

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

// Animate the meshs

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  render();
}

// Render the scene

function render() {

  var time = Date.now() * 0.00005;

  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}