import {Component} from 'whs/src/framework/core/Component';
import {MeshComponent} from 'whs/src/framework/core/MeshComponent';
import {Plane} from 'whs/src/framework/components/meshes/Plane';
import {Loop} from 'whs/src/framework/extras/Loop';
import {texture} from 'whs/src/framework/utils/texture';
import * as THREE from 'whs/src/framework/three';

const TweenLite = require('gsap').TweenLite;

class Space extends Component {
  constructor(params = {}) {
    super(params, Space.defaults, Space.instructions);

    this.native = new THREE.Mesh();

    const geom = new THREE.Geometry();
    geom.vertices = [
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(-1, 0, 0)
    ];

    const geom2 = geom.clone();
    geom2.faces = [
      new THREE.Face3(0, 1, 2)
    ];

    const triangle = new THREE.Line(
      geom,
      new THREE.LineBasicMaterial({color: 0x000000})
    );

    const triangle2 = new THREE.Mesh(
      geom2,
      new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide})
    );

    const randomInteger = (min, max) => Math.round(Math.random() * (max - min) + min);

    for (let i = 0; i < 100; i++) {
      const newTriangle = Math.random() > 0.5 ? triangle.clone() : triangle2.clone();

      if (Math.random() > 0.9) {
        newTriangle.material = newTriangle.material.clone();
        newTriangle.material.color.setRGB(Math.random(), Math.random(), Math.random());
      }

      const scaleNum = randomInteger(1, 3);
      newTriangle.position.set(randomInteger(-70, 70), randomInteger(-50, 50), randomInteger(-20, 20));
      newTriangle.scale.set(scaleNum, scaleNum, scaleNum);
      newTriangle.rotation.set(Math.PI * Math.random(), Math.PI * Math.random(), Math.PI * Math.random());
      newTriangle.velocity = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize().divideScalar(100);
      this.native.add(newTriangle);

      new Loop(() => {
        newTriangle.position.add(newTriangle.velocity);

        if (newTriangle.position.x > 71 
          || newTriangle.position.x < -71
          || newTriangle.position.y > 51
          || newTriangle.position.y < -51) newTriangle.velocity.negate();
      }).start(this.params.world);
    }
  }
} 

Space = MeshComponent(Space);

export {
  Space
};
