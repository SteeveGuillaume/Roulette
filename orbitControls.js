import { MOUSE, TOUCH } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const DEFAULT_CONFIG = {
  target: { x: 27, y: 0, z: -27 },
  minPolarAngle: Math.PI / 5,
  maxPolarAngle: Math.PI / 2.5,
  minAzimuthAngle: Math.PI / 2,
  maxAzimuthAngle: -Math.PI / 2,
  mouseButtons: {
    LEFT: MOUSE.PAN,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.PAN
  },
  touches: {
    TWO: TOUCH.DOLLY_PAN,
    ONE: TOUCH.PAN
  }
};

export function initializeOrbitControls(camera, renderer, config = {}) {
  const controls = new OrbitControls(camera, renderer.domElement);

  // Merge default config with user-provided config
  const {
    target,
    minPolarAngle,
    maxPolarAngle,
    minAzimuthAngle,
    maxAzimuthAngle,
    mouseButtons,
    touches
  } = { ...DEFAULT_CONFIG, ...config };

  // Set the target position
  controls.target.set(target.x, target.y, target.z);

  // Set the polar angle limits
  controls.minPolarAngle = minPolarAngle;
  controls.maxPolarAngle = maxPolarAngle;

  // Set the azimuth angle limits
  controls.minAzimuthAngle = minAzimuthAngle;
  controls.maxAzimuthAngle = maxAzimuthAngle;

  // Set mouse buttons configuration
  controls.mouseButtons = mouseButtons;

  // Set touch controls configuration
  controls.touches = touches;

  return controls;
}