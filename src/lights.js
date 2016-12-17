import { AmbientLight } from 'whs/src/framework/components/lights/AmbientLight';
import { SpotLight } from 'whs/src/framework/components/lights/SpotLight';

export function addLights(world) {
  new AmbientLight({
    light: {
      intensity: 0.5
    }
  }).addTo(world);

  const spotty = new SpotLight({
    light: {
      intensity: 1,
      distance: 100,
      angle: 90
    },

    position: [10, 10, 20]
  });

  spotty.addTo(world);

  return spotty;
}