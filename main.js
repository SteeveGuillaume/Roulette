// Import necessary modules and styles
import { AxesHelper, Color, Scene } from 'three';
import './style.css';
import { initializeLights } from './lights.js';
import { initializeCamera } from './camera.js';
import { initializeRenderer } from './renderer.js';
import { initializeChipStack } from './chipStacks.js';
import { initializeOrbitControls } from './orbitControls.js';
import { initializeEventHandlers, updateWiningNumberList } from './eventHandlers.js';
import { initializeCameraSliders } from './cameraSliders.js';
import { initializeMainPlane } from './plane.js';
import { initializeBoxes } from './boxes.js';
import { populatePictureBets } from './pictureBets.js';
import { initializeDialogHandlers } from './dialogHandlers.js';

// Utility function to display error messages to the user
function displayError(message) {
  // Check if an error container already exists
  const errorContainer = document.getElementById('error-container');
  if (!errorContainer) {
    // Create a new error container if it doesn't exist
    const container = document.createElement('div');
    container.id = 'error-container';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    container.style.color = 'white';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.zIndex = '1000';
    container.innerText = message;
    document.body.appendChild(container);
  } else {
    // Append message to existing container
    errorContainer.innerText += '\n' + message;
  }
}

// Scene setup
const scene = new Scene();
scene.background = new Color(0x262626); // Set the background color of the scene
scene.add(new AxesHelper()); // Add an axis helper to the scene for reference

// Initialize components with error handling
try {
  initializeLights(scene); // Initialize lights and add them to the scene
} catch (error) {
  const errorMessage = 'Error initializing lights: ' + error.message;
  console.error(errorMessage);
  displayError(errorMessage); // Display error message to the user
}

let camera;
try {
  camera = initializeCamera(scene); // Initialize the camera
} catch (error) {
  const errorMessage = 'Error initializing camera: ' + error.message;
  console.error(errorMessage);
  displayError(errorMessage); // Display error message to the user
}

let renderer;
try {
  renderer = initializeRenderer(scene); // Initialize the renderer
} catch (error) {
  const errorMessage = 'Error initializing renderer: ' + error.message;
  console.error(errorMessage);
  displayError(errorMessage); // Display error message to the user
}

let controls;
try {
  controls = initializeOrbitControls(camera, renderer); // Initialize orbit controls
} catch (error) {
  const errorMessage = 'Error initializing orbit controls: ' + error.message;
  console.error(errorMessage);
  displayError(errorMessage); // Display error message to the user
}

try {
  initializeBoxes(scene); // Initialize boxes and add them to the scene
  
  //setBlinkingBoxes(scene, ['number5', 'number10', 'number15']); // Exemple de boîtes à faire clignoter

} catch (error) {
  const errorMessage = 'Error initializing boxes: ' + error.message;
  console.error(errorMessage);
  displayError(errorMessage); // Display error message to the user
}

try {
  initializeMainPlane(scene); // Initialize the main plane
} catch (error) {
  const errorMessage = 'Error initializing main plane: ' + error.message;
  console.error(errorMessage);
  displayError(errorMessage); // Display error message to the user
}

let winningNumberList;
try {
    winningNumberList = initializeChipStack(scene); // Initialize chip stack
} catch (error) {
    const errorMessage = 'Error initializing chip stack: ' + error.message;
    console.error(errorMessage);
    displayError(errorMessage); // Display error message to the user
}

let pbPositionList;
try {
pbPositionList = populatePictureBets(scene); // Populate picture bets
} catch (error) {
    const errorMessage = 'Error populating picture bets: ' + error.message;
    console.error(errorMessage);
    displayError(errorMessage); // Display error message to the user
}

try {
  initializeEventHandlers(scene, camera, controls, winningNumberList, pbPositionList); // Initialize event handlers
} catch (error) {
  const errorMessage = 'Error initializing event handlers: ' + error.message;
  console.error(errorMessage);
  displayError(errorMessage); // Display error message to the user
}

try {
  initializeDialogHandlers(); // Initialize dialog handlers
} catch (error) {
  const errorMessage = 'Error initializing dialog handlers: ' + error.message;
  console.error(errorMessage);
  displayError(errorMessage); // Display error message to the user
}

try {
  initializeCameraSliders(controls); // Create camera sliders
} catch (error) {
  const errorMessage = 'Error creating camera sliders: ' + error.message;
  console.error(errorMessage);
  displayError(errorMessage); // Display error message to the user
}

// Animation loop
function refresh() {
  renderer.render(scene, camera); // Render the scene using the camera
  controls.update(); // Update controls for smooth interaction
  requestAnimationFrame(refresh); // Recursively call refresh to create an animation loop
}
refresh(); // Start the animation loop

document.addEventListener('DOMContentLoaded', () => {
  refreshButton.addEventListener('click', () => {
    winningNumberList = initializeChipStack(scene); // Initialize chip stack
    updateWiningNumberList(winningNumberList);
    populatePictureBets(scene); // Populate picture bets
  });

  // Listen for the custom event dispatched from dialogHandlers.js
  document.addEventListener('settingsSubmitted', (event) => {
    winningNumberList = initializeChipStack(scene); // Initialize chip stack
    updateWiningNumberList(winningNumberList);
  });

  document.addEventListener('touchmove', e => {
    if (!e.target.closest('input[type="range"]')) {
        e.preventDefault();
    }
  }, { passive: false }); // prevent page scrolling on touchmove
});

