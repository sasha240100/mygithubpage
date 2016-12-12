import { World } from 'whs/src/framework/core/World';
import { PerspectiveCamera } from 'whs/src/framework/components/cameras/PerspectiveCamera';
import { Group } from 'whs/src/framework/extras/Group';

const world = new World({
  autoresize: true,

  gravity: {
    x: 0,
    y: -100,
    z: 0
  },

  rendering: {
    renderer: {
      antialias: true,
      alpha: true
    },

    background: {
      color: 0xcccccc,
      opacity: 0
    }
  },
/*
  camera: {
    far: 10000,
    position: {
      z: 50,
      y: 25, // 5
      x: -10
    }
  },*/

  modules: {
    camera: false
  }
});

world.$camera = new PerspectiveCamera({
  camera: {
    far: 10000,
    aspect: world.params.width / world.params.height,
    fov: 75
  },

  position: [-10, 25, 50]
});

const cameraContainer = new Group(world.$camera);
cameraContainer.position.x = -10;

cameraContainer.addTo(world);

world.start();

export {
	world,
  cameraContainer
};
