import { PerspectiveCamera } from "three";

const DEFAULT_CAMERA_CONFIG = {
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.01,
  far: 1000,
  position: {
    x: 63,
    y: 89,
    z: -134
  }
};

export function initializeCamera(scene, config = {}) {
  const { fov, aspect, near, far, position } = { ...DEFAULT_CAMERA_CONFIG, ...config };
  
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(position.x, position.y, position.z);
  
  scene.add(camera);
  
  return camera;
}


/** EXEMPLE UTILISATION
 * 
 * 
 import { initializeCamera } from './camera.js';

const customCameraConfig = {
  fov: 60,
  position: {
    x: 50,
    y: 100,
    z: -150
  }
};

const camera = initializeCamera(scene, customCameraConfig);

 */