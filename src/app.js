import world from './world';
import { addLights } from './lights';
import {Planer} from './components/Planer';
import {Space} from './components/Space';
import {Lincor} from './components/Lincor';
import {Connector} from './components/Connector';
import {Menu} from './components/Menu';
import {Group} from 'whs/src/framework/extras/Group'
import {VirtualMouse} from 'whs/src/framework/extras/VirtualMouse';
import {OrbitControls} from 'whs/src/framework/extras/controls/OrbitControls';
import {Plane} from 'whs/src/framework/components/meshes/Plane';
import * as THREE from 'whs/src/framework/three';

const TweenLite = require('gsap').TweenLite;

const spotty = addLights(world);

const vmouse = new VirtualMouse(world, true);

window.planer = new Planer({
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

vmouse.track(lincor);

lincor.on('mouseover', () => {
  TweenLite.to(lincor.scale, 1, {x: 6, y: 6, z: 6, onUpdate: () => {
    connector.updateLincor(lincor.position.clone().add(new THREE.Vector3(0, 2 * lincor.scale.y, 0)));
  }});
});

lincor.on('mouseout', () => {
  TweenLite.to(lincor.scale, 0.5, {x: 3, y: 3, z: 3, onUpdate: () => {
    connector.updateLincor(lincor.position.clone().add(new THREE.Vector3(0, 2 * lincor.scale.y, 0)));
  }});
});

planer.addTo(world);
planer.updateImage('/img/showcase1.jpg');
lincor.addTo(world);
connector.addTo(world);
(new Space({world: world})).addTo(world);

(new Menu({
  position: [-40, -5, 2],
  vmouse: vmouse,
  planer: planer
})).addTo(world);

connector.lineAnimation(world);

const lookAtVec = new THREE.Vector3(-7, 5, 0);

vmouse.on('move', () => {
  world.$camera.position.x = vmouse.x * 10 - 10;
  world.$camera.lookAt(lookAtVec);
  spotty.position.x = vmouse.x * 30 + 10;
});

new Plane({
  geometry: {
    width: 400, 
    height: 100
  },

  position: [0, -60, -10],

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

