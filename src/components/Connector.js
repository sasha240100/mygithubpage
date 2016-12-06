import {Component} from 'whs/src/framework/core/Component';
import {MeshComponent} from 'whs/src/framework/core/MeshComponent';
import {Element} from 'whs/src/framework/core/Element';
import {Loop} from 'whs/src/framework/extras/Loop';
import * as THREE from 'whs/src/framework/three';

class Connector extends Component {
  constructor(params = {}) {
    super(params, Connector.defaults, Connector.instructions);

    this.native = new THREE.Mesh();

    const planerVec = new THREE.Vector3().copy(this.params.planer);
    const lincorVec = new THREE.Vector3().copy(this.params.lincor);

    this.$line1 = new Element(
      new THREE.Line(
        (() => {
          const geom = new THREE.Geometry();
          geom.vertices = [
            planerVec.clone().sub(new THREE.Vector3(27, 17, 0)),
            lincorVec.clone()
          ];

          return geom;
        })(),
        new THREE.LineBasicMaterial({color: 0x000000})
      ),
      [MeshComponent]
    );

    this.$line2 = new Element(
      new THREE.Line(
        (() => {
          const geom = new THREE.Geometry();
          geom.vertices = [
            planerVec.clone().sub(new THREE.Vector3(-27, 17, 0)),
            lincorVec.clone()
          ];

          return geom;
        })(),
        new THREE.LineBasicMaterial({color: 0x000000})
      ),
      [MeshComponent]
    );

    this.$line3 = new Element(
      new THREE.Line(
        (() => {
          const geom = new THREE.Geometry();
          geom.vertices = [
            planerVec.clone().sub(new THREE.Vector3(27, -17, 0)),
            lincorVec.clone()
          ];

          return geom;
        })(),
        new THREE.LineBasicMaterial({color: 0x000000})
      ),
      [MeshComponent]
    );

    this.$line4 = new Element(
      new THREE.Line(
        (() => {
          const geom = new THREE.Geometry();
          geom.vertices = [
            planerVec.clone().sub(new THREE.Vector3(0, 17, 0)),
            lincorVec.clone()
          ];

          return geom;
        })(),
        new THREE.LineBasicMaterial({color: 0x000000})
      ),
      [MeshComponent]
    );

    this.$line5 = new Element(
      new THREE.Line(
        (() => {
          const geom = new THREE.Geometry();
          geom.vertices = [
            planerVec.clone().sub(new THREE.Vector3(0, -17, 0)),
            lincorVec.clone()
          ];

          return geom;
        })(),
        new THREE.LineBasicMaterial({color: 0x000000})
      ),
      [MeshComponent]
    );

    this.$line1.addTo(this);
    this.$line2.addTo(this);
    this.$line3.addTo(this);
    this.$line4.addTo(this);
    this.$line5.addTo(this);
  }

  lineAnimation(world) {
    const vec1 = this.$line2.geometry.vertices[0];
    const vec1_ = this.$line2.geometry.vertices[0].clone();
    const vec2 = this.$line3.geometry.vertices[0];
    const vec2_ = this.$line3.geometry.vertices[0].clone();
    const vec3 = this.$line4.geometry.vertices[0];
    const vec3_ = this.$line4.geometry.vertices[0].clone();
    const vec4 = this.$line5.geometry.vertices[0];
    const vec4_ = this.$line5.geometry.vertices[0].clone();

    new Loop((clock) => {
      const t = clock.getElapsedTime();

      vec1.x = vec1_.x + Math.sin(t) * 10 - 10;
      vec2.y = vec2_.y + Math.cos(t*2) * 5 - 5;
      vec3.x = vec3_.x + Math.cos(t) * 20;
      vec4.x = vec4_.x + Math.sin(t*2) * 5 - 5;
      this.$line2.geometry.verticesNeedUpdate = true;
      this.$line3.geometry.verticesNeedUpdate = true;
      this.$line4.geometry.verticesNeedUpdate = true;
      this.$line5.geometry.verticesNeedUpdate = true;
    }).start(world);
  }

  updateLincor(vec3) {
    this.$line1.geometry.vertices[1].copy(vec3);
    this.$line2.geometry.vertices[1].copy(vec3);
    this.$line3.geometry.vertices[1].copy(vec3);
    this.$line4.geometry.vertices[1].copy(vec3);
    this.$line5.geometry.vertices[1].copy(vec3);
    this.$line1.geometry.verticesNeedUpdate = true;
    this.$line2.geometry.verticesNeedUpdate = true;
    this.$line3.geometry.verticesNeedUpdate = true;
    this.$line4.geometry.verticesNeedUpdate = true;
    this.$line5.geometry.verticesNeedUpdate = true;
  }
}

Connector = MeshComponent(Connector);
Connector.defaults = Object.assign(Connector.defaults, {
  planer: {
    x: 0,
    y: 0,
    z: 0
  },

  lincor: {
    x: 0,
    y: 0,
    z: 0
  }
});

export {
  Connector
};
