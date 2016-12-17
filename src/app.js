import {world, cameraContainer} from './world';
import {Planer} from './components/Planer';
import {Space} from './components/Space';
import {Lincor} from './components/Lincor';
import {Connector} from './components/Connector';
import {Menu} from './components/Menu';
import {VirtualMouse} from 'whs/src/framework/extras/VirtualMouse';
import {Plane} from 'whs/src/framework/components/meshes/Plane';
import * as THREE from 'whs/src/framework/three';
import './lib/polyfill';
import {hoverBody, unHoverBody} from './utils/changeCursor';

const TweenLite = require('gsap').TweenLite;

const vmouse = new VirtualMouse(world, true);

const planer = new Planer({
  vmouse: vmouse,
  world: world,
  position: [20, 10, 0]
});

const lincor = new Lincor({
  position: [-40, -20, 2],
  scale: [3, 3, 3]
});

const connector = new Connector({
  planer: planer.position,
  lincor: lincor.position.clone().add(new THREE.Vector3(0, 6, 0))
});

lincor.connector = connector;

vmouse.track(lincor);

lincor.on('mouseover', () => {
  hoverBody();
  TweenLite.to(lincor.scale, 1, {x: 6, y: 6, z: 6, onUpdate: () => {
    connector.updateLincor(lincor.position.clone().add(new THREE.Vector3(0, 2 * lincor.scale.y, 0)));
  }});
});

lincor.on('mouseout', () => {
  unHoverBody();
  TweenLite.to(lincor.scale, 0.5, {x: 3, y: 3, z: 3, onUpdate: () => {
    connector.updateLincor(lincor.position.clone().add(new THREE.Vector3(0, 2 * lincor.scale.y, 0)));
  }});
});

planer.addTo(world);
planer.updateImage('/img/showcase1.png');
lincor.addTo(world);
connector.addTo(world);
(new Space({world: world})).addTo(world);

(new Menu({
  position: [-40, -5, 2],
  vmouse: vmouse,
  planer: planer,
  lincor: lincor
})).addTo(world);

connector.lineAnimation(world);

const lookAtVec = new THREE.Vector3(-7, 25, 0); // 5
const getLookVec = () => lookAtVec.clone().sub(cameraContainer.position);

let cameraXpos = -10;
let cameraLocked = false;

vmouse.on('move', () => {
  // console.log(cameraLocked);
  // if (cameraLocked) return;
  world.$camera.position.x = vmouse.x * 10;
  world.$camera.lookAt(getLookVec());
});

TweenLite.to(lookAtVec, 3, {y: 5, onUpdate: () => {
  world.$camera.position.y = lookAtVec.y;
  world.$camera.lookAt(getLookVec());
}, ease: Power3.easeOut});

new Plane({
  geometry: {
    width: 900, 
    height: 300
  },

  position: [0, -160, -10],

  rotation: {
    z: - Math.PI / 32
  },

  material: {
    kind: 'basic',
    color: 0x222222
  }
}).addTo(world);

// TweenLite.to(planer.rotation, 1, {x: Math.PI / 2, ease:Power2.easeInOut});

// world.setControls(new OrbitControls());

/* STAGES */

let currentStage = 0;
let activeContent;

const resetContent = () => {
  if (!activeContent) return;
  activeContent.className = 'content';
  activeContent = null;
}

// 0

function projects() {
  if (currentStage === 0) return;
  resetContent();

  cameraLocked = true;
  window.location.hash = '';

  document.getElementsByClassName('dark')[0].className = 'dark';

  TweenLite.to(lookAtVec, 3, {y: 5, x: -10, onUpdate: () => {
    world.$camera.position.y = lookAtVec.y;
    cameraContainer.position.x = lookAtVec.x;
    world.$camera.lookAt(getLookVec());
  }, onComplete: () => {
    cameraLocked = false;
  }, ease: Power3.easeOut});

  document.getElementsByTagName('header')[0].className = '';
  document.getElementById('about').className = 'content';

  currentStage = 0;
}

window.goToProjects = projects;

// 1
function about() {
  if (currentStage === 1) return;
  resetContent();

  cameraLocked = true;
  window.location.hash = 'about';

  document.getElementsByClassName('dark')[0].className = 'dark';

  TweenLite.to(lookAtVec, 3, {y: -110, x: -10, onUpdate: () => {
    world.$camera.position.y = lookAtVec.y;
    cameraContainer.position.x = lookAtVec.x;
    world.$camera.lookAt(getLookVec());
  }, onComplete: () => {
    cameraLocked = false;
  }, ease: Power3.easeOut});

  document.getElementsByTagName('header')[0].className += ' inversed';
  activeContent = document.getElementById('about');
  activeContent.className = 'content show';

  currentStage = 1;
}

window.goToAbout = about;

let isScrolled = false;
let isScrolledTimout;
let lastScrollTop = 0;
let wheelPrevented = false;

document.getElementById('about').addEventListener('scroll', () => {
  isScrolled = true;
  window.clearTimeout(isScrolledTimout);
  isScrolledTimout = window.setTimeout(() => {isScrolled = false}, 300);
  const scrollTop = document.getElementById('about').scrollTop;
  if (scrollTop !== lastScrollTop && scrollTop === 0) {
    console.log('wheel prevented!');
    wheelPrevented = true;
  }
  lastScrollTop = scrollTop;
});

let wheelStoped = true;
let wheelStopTimeout;

window.addWheelListener(document, e => {
  window.clearTimeout(wheelStopTimeout);
  wheelStopTimeout = window.setTimeout(() => {wheelStoped = true}, 300);

  if (e.deltaY > 0)  { // down
    if (currentStage === 0) window.goToAbout();
  } else { //up
    if (wheelPrevented && !wheelStoped) return;
    wheelStoped = false;

    if (
      currentStage === 1
      && document.getElementById('about').scrollTop <= 0
      && isScrolled === false
      ) window.goToProjects();
  }
}, false);

// 2
function projectDetails(customScid = planer.scid) {
  if (currentStage === 2) return;
  resetContent();

  cameraLocked = true;

  document.getElementsByClassName('dark')[0].className = 'dark active';
  document.getElementsByTagName('header')[0].className += ' inversed';
  activeContent = document.getElementById(customScid);
  window.location.hash = customScid;
  activeContent.className = 'content show';

  TweenLite.to(lookAtVec, 3, {x: -200, y: 5, onUpdate: () => {
    world.$camera.position.y = lookAtVec.y;
    cameraContainer.position.x = lookAtVec.x;
    world.$camera.lookAt(getLookVec());
  }, onComplete: () => {
    cameraLocked = false;
  }, ease: Power3.easeOut});

  // document.getElementsByTagName('header')[0].className += ' inversed';
  // document.getElementById('about').className += ' show';

  currentStage = 2;
}

window.goToProjectDetails = projectDetails;

lincor.on('click', () => {
  console.log(1);
  projectDetails();
});

window.onload = function () {
  const hash = window.location.hash.replace('#', '');

  if (hash === '') return;
  else if (hash === 'about') about();
  else if (hash.length >= 1) projectDetails(hash);
  else return;
} 
