import { AmbientLight, PointLight, AxesHelper } from 'three';

const DEFAULT_LIGHTS_CONFIG = {
  ambientLight: {
    color: 0xffffff,
    intensity: 0.5
  },
  pointLight: {
    color: 0xffffff,
    intensity: 0.5,
    position: { x: -10, y: 10, z: -10 },
    castShadow: true,
    shadow: {
      mapSize: { width: 1024, height: 1024 },
      camera: { near: 0.1, far: 1000 }
    }
  }
};

export function initializeLights(scene, config = {}) {
  const { ambientLight, pointLight } = { ...DEFAULT_LIGHTS_CONFIG, ...config };

  // Ambient Light
  const ambient = new AmbientLight(ambientLight.color, ambientLight.intensity);
  scene.add(ambient);

  // Point Light
  const light = new PointLight(pointLight.color, pointLight.intensity);
  light.position.set(pointLight.position.x, pointLight.position.y, pointLight.position.z);
  light.castShadow = pointLight.castShadow;
  light.shadow.mapSize.width = pointLight.shadow.mapSize.width;
  light.shadow.mapSize.height = pointLight.shadow.mapSize.height;
  light.shadow.camera.near = pointLight.shadow.camera.near;
  light.shadow.camera.far = pointLight.shadow.camera.far;
  scene.add(light);
}
