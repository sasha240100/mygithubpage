import { World } from 'whs/src/framework/core/World';

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

  camera: {
    far: 10000,
    position: {
      z: 50,
      y: 25, // 5
      x: -10
    }
  },
});

world.start();

export {
	world as default
};
