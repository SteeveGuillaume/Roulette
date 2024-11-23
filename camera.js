import { PerspectiveCamera } from "three";

const DEFAULT_CAMERA_CONFIG = {
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.01,
  far: 1000,
  position: {
    x: 27,
    y: 50,
    z: 0
  }
};

export function initializeCamera(scene, config = {}) {
  const { fov, aspect, near, far, position } = { ...DEFAULT_CAMERA_CONFIG, ...config };
  
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(position.x, position.y, position.z);
  
  scene.add(camera);
  
  return camera;
}

export function animateCamera(camera, controls, targetX, duration) {
  const startX = camera.position.x;
  const startTargetX = controls.target.x;
  const startTime = performance.now();

  function animate() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;
    const t = Math.min(elapsedTime / duration, 1); // Normalized time [0, 1]

    // Interpolate positions
    camera.position.x = startX + (targetX - startX) * t;
    controls.target.x = startTargetX + (targetX - startTargetX) * t;
    controls.update();

    if (t < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
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