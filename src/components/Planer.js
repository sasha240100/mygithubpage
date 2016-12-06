import {Component} from 'whs/src/framework/core/Component';
import {MeshComponent} from 'whs/src/framework/core/MeshComponent';
import {Plane} from 'whs/src/framework/components/meshes/Plane';
import {Loop} from 'whs/src/framework/extras/Loop';
import {texture} from 'whs/src/framework/utils/texture';
import * as THREE from 'whs/src/framework/three';

const TweenLite = require('gsap').TweenLite;
const TextureLoader = new THREE.TextureLoader();

class Planer extends Component {
  constructor(params = {}) {
    super(params, Planer.defaults, Planer.instructions);

    // this.copy(new Plane({
    //   geometry: [60, 40],
    //   buffer: true,
    //   material: {
    //     kind: 'phong',
    //     transparent: true,
    //     opacity: 0
    //   }
    // }));

    this.native = new THREE.Mesh();
    this.readyForUpdate = true;

    this.params = params;

    const mP = new Plane({
      geometry: [5.7, 5.7],
      buffer: true,
      material: {
        kind: 'basic',
        shininess: 10,
        side: THREE.DoubleSide,
        map: new THREE.Texture()
      }
    })

    const offset = {
      x: -24.5,
      y: 14.5
    }

    const vmouse = this.params.vmouse;

    this.updateRotation = (o) => () => {
      o.rotation.x = o.rotation.x;
    };

    this.minPlanes = []; // [x][y]

    for (let x = 0; x < 9; x++) { // 9
      this.minPlanes[x] = [];

      for (let y = 0; y < 6; y++) { // 6
        const np = mP.clone();

        np.material = np.material.clone();
        this.minPlanes[x].push(np);

        np.addTo(this).then(o => {
          o.position.set(x*5.7 + offset.x - 3, -y*5.7 + offset.y - 1, 3);

          vmouse.track(o);
          o.on('mouseover', () => {
            TweenLite.to(o.rotation, 0.2, {x: Math.PI/2, ease: Power2.easeInOut, onUpdate: this.updateRotation(o)});
          });

          o.on('mouseout', () => {
            TweenLite.to(o.rotation, 0.4, {x: 0, delay: 0.4, ease: Power2.easeInOut, onUpdate: this.updateRotation(o)});
          });
        })
      }
    }

    super.wrap();
  }

  updateImage(url) {
    if (!this.readyForUpdate) return;
    this.readyForUpdate = false;

    for (let x = 0; x < 9; x++) { // 9
      for (let y = 0; y < 6; y++) { // 6
        TextureLoader.load(url, (texture) => {
          const minPlane = this.minPlanes[x][y];

          texture.repeat.set(1/9, 1/6);
          texture.offset.set(x/9, -y/6 - 1/6);

          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.needsUpdate = true;

          TweenLite.to(minPlane.rotation, 0.2, {
            x: Math.PI/2, 
            delay: (x*6 + y)/40, 
            ease: Power2.easeInOut, 
            onUpdate: this.updateRotation(minPlane),
            onComplete: () => {
              minPlane.material.map = texture;
            }
          });

          TweenLite.to(minPlane.rotation, 0.2, {
            x: 0, 
            delay: (x*6 + y + 15)/40, 
            ease: Power2.easeInOut, 
            onUpdate: this.updateRotation(minPlane)
          });
        });
      }
    }

    window.setTimeout(() => {this.readyForUpdate = true;}, ((9*6 + 6 + 15)/40 + 0.2)*1000);
  }
} 

Planer = MeshComponent(Planer);
Planer.defaults = Object.assign(Planer.defaults, {
  id: 0,
  radius: 12,
  count: 4
});

export {
  Planer
};
