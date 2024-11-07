import { MOUSE, TOUCH } from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const DEFAULT_CONFIG = {
  target: { x: 27, y: 0, z: -27 },
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
    mouseButtons,
    touches
  } = { ...DEFAULT_CONFIG, ...config };

  // Set the target position
  controls.target.set(target.x, target.y, target.z);

  // Set mouse buttons configuration
  controls.mouseButtons = mouseButtons;

  // Set touch controls configuration
  controls.touches = touches;

  return controls;
}