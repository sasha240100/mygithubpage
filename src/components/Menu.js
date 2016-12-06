import {Component} from 'whs/src/framework/core/Component';
import {Element} from 'whs/src/framework/core/Element';
import {MeshComponent} from 'whs/src/framework/core/MeshComponent';
import {Loop} from 'whs/src/framework/extras/Loop';
import * as THREE from 'whs/src/framework/three';

const TweenLite = require('gsap').TweenLite;

class Menu extends Component {
  constructor(params = {}) {
    super(params, Menu.defaults, Menu.instructions);

    this.native = new THREE.Mesh();
    this.itemsCount = 0;
    this.vmouse = this.params.vmouse;
    this.planer = this.params.planer;

    super.wrap();

    this.createMenuItem(2, '/img/showcase1.jpg');
    this.createMenuItem(2, '/img/showcase2.jpg');
    this.createMenuItem(2);
    this.createMenuItem(2);
    this.createMenuItem(2);
    this.createMenuItem(2);
  }

  createMenuItem(size = 1, image = '/img/showcase1.jpg') {
    const geometry = new THREE.Geometry();
    const geometry2 = new THREE.Geometry();
    const lineDiff = 0.2;
    const lineDiffx = lineDiff / 0.2 * 0.26;
    const lineDiffy = lineDiff / 0.2 * 0.12;
    
    geometry.vertices = [
      new THREE.Vector3(0, 1.1 - lineDiff, 0), // 0
      new THREE.Vector3(0, 1.1, 0), // 1
      new THREE.Vector3(1 - lineDiffx, lineDiffy, 0), // 2
      new THREE.Vector3(1, 0, 0), // 3
      new THREE.Vector3(-1 + lineDiffx, lineDiffy, 0), // 4
      new THREE.Vector3(-1, 0, 0) // 5
    ];

    geometry2.vertices = [
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(-1, 0, 0)
    ];

    geometry.faces = [
      new THREE.Face3(0, 1, 3),
      new THREE.Face3(0, 2, 3),
      new THREE.Face3(2, 3, 5),
      new THREE.Face3(2, 4, 5),
      new THREE.Face3(0, 5, 4),
      new THREE.Face3(1, 0, 5)
    ];

    geometry2.faces = [
      new THREE.Face3(0, 1, 2)
    ];

    const item = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xd60035, side: THREE.DoubleSide})); // 0x6400cb
    const itemAlias = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({transparent: true, opacity: 0}));

    item.scale.multiplyScalar(size);
    itemAlias.scale.multiplyScalar(size);

    if (this.itemsCount % 2 === 1) {
      item.rotation.z = Math.PI;
      item.position.y += this.itemsCount * 4 + 2;
    } else item.position.y += this.itemsCount * 4;

    itemAlias.position.copy(item.position);
    itemAlias.quaternion.copy(item.quaternion);

    const element = new Element(item, [MeshComponent]);
    const elementAlias = new Element(itemAlias, [MeshComponent]);

    element.addTo(this);
    elementAlias.addTo(this);

    this.vmouse.track(elementAlias);

    const updPosZ = () => {elementAlias.position.z = element.position.z};

    const destColor = new THREE.Color(0x6400cb);
    const tmpColor = new THREE.Color(0xd60035);
    const mdColor = new THREE.Color(0xd6ce00);

    let isActive = false;

    elementAlias.on('mouseover', () => {
      TweenLite.to(element.position, 0.3, {z: 1, ease: Power2.easeInOut});
      TweenLite.to(element.material.color, 0.3, {r: destColor.r, g: destColor.g, b: destColor.b, ease: Power2.easeInOut});
    });

    const returnBack = () => {
      TweenLite.to(element.position, 0.1, {z: 0, ease: Power2.easeInOut});
      TweenLite.to(element.material.color, 0.1, {r: tmpColor.r, g: tmpColor.g, b: tmpColor.b, ease: Power2.easeInOut});
    };

    elementAlias.on('mouseout', returnBack);

    elementAlias.on('mousedown', () => {
      isActive = true;
      TweenLite.to(element.position, 0.1, {z: -0.5, ease: Power2.easeInOut});
      TweenLite.to(element.material.color, 0.1, {r: mdColor.r, g: mdColor.g, b: mdColor.b, ease: Power2.easeInOut});
    });

    elementAlias.on('click', () => {
      this.planer.updateImage(image);
    });

    this.vmouse.on('mouseup', () => {
      if (isActive) {
        returnBack();
        isActive = false;
      }
    });


    this.itemsCount++;
  }
} 

Menu = MeshComponent(Menu);

export {
  Menu
};
