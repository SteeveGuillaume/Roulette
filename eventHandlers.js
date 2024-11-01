import { Raycaster, Vector2, Mesh} from 'three';
import { showChips, hideChips } from './chipCreation.js';

const BOX_SECTION = 18;
const POSITION_MAP = {
  "19": { x: (BOX_SECTION * 7) - 9, z: (BOX_SECTION / -2) },
  "20": { x: (BOX_SECTION * 7) - 9, z: (BOX_SECTION * -2) - (BOX_SECTION / -2) },
  "21": { x: (BOX_SECTION * 7) - 9, z: (BOX_SECTION * -3) - (BOX_SECTION / -2) },
  "17": { x: (BOX_SECTION * 6) - 9, z: (BOX_SECTION * -2) - (BOX_SECTION / -2) },
  "23": { x: (BOX_SECTION * 8) - 9, z: (BOX_SECTION * -2) - (BOX_SECTION / -2) }
};

export function initializeEventHandlers(scene, camera, controls, winningNumberList, pbPositionList) {
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  let dragging = false;
  let lastMouseX = 0;

  const rotateButton = document.getElementById("rotateButton");
  const displayText = document.getElementById("displayText");

  const handleControlStart = () => dragging = true;
  const handleControlChange = () => {
    if (!dragging) showChips(scene);
    displayText.innerHTML = "";
  };
  const handleControlEnd = () => dragging = false;

  const checkSpecialPositions = (boxHit) => {
    const position = Object.entries(POSITION_MAP).find(([_, pos]) => 
      boxHit.position.x === pos.x && boxHit.position.z === pos.z
    );
    if (position) displayText.innerHTML = pbPositionList[`box${position[0]}`];
  };

  const hideOutOfRangeChips = (boxHit) => {
    scene.traverse(node => {
      if (node instanceof Mesh && node.geometry.type === "CylinderGeometry") {
        const xCondition = node.position.x !== 0 && Math.abs(node.position.x - boxHit.position.x) > 12;
        const zCondition = node.position.z !== 0 && Math.abs(node.position.z - boxHit.position.z) > (boxHit.name == 'number0' ? 18 : 12);
        if (xCondition || zCondition) hideChips(node);
      }
    });
  };

  const onClickZ = (event) => {
    if (dragging) {
      dragging = false;
    } else {
      showChips(scene);
      pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(pointer, camera);
      raycaster.intersectObjects(scene.children, true).forEach(intersect => {
        if (intersect.object.geometry.type === "PlaneGeometry" && intersect.object.name.includes("number")) {
          displayText.innerHTML = winningNumberList[0][intersect.object.name.slice(6)].getText();
          checkSpecialPositions(intersect.object);
          hideOutOfRangeChips(intersect.object);
        }
      });
    }
  };

  // Start continuous rotation using OrbitControls
  function startRotation(e) { 
    lastMouseX = e.clientX || e.changedTouches[0].clientX; // Initialize last mouse X position
  }
  
  function changeRotation(e){  
    dragging = true;
    const currentMouseX = e.clientX || e.changedTouches[0].clientX;
    const deltaX = currentMouseX - lastMouseX; // Calculate mouse movement delta
    checkDirection(currentMouseX);
    lastMouseX = currentMouseX;   // Update lastMouseX for next move

    controls.autoRotate = true;
    controls.autoRotateSpeed += deltaX * 0.002;
    stopRotation(e);
    controls.update();
         
  }

  // Stop the continuous rotation
  function stopRotation(e) {
    setTimeout(() => {
      controls.autoRotate = false; // Apply delay before stopping auto-rotation
    }, 100);  // 200ms delay
  }
      
  function checkDirection(currentMouseX) {
    if (currentMouseX < lastMouseX && controls.autoRotateSpeed > 0) controls.autoRotateSpeed *= -1;
    if (currentMouseX > lastMouseX && controls.autoRotateSpeed < 0) controls.autoRotateSpeed *= -1;
  }
  
  // Add event listeners to the rotate button
  rotateButton.addEventListener("touchstart",  e => {startRotation(e)});
  rotateButton.addEventListener("touchmove",  e => {changeRotation(e)});

  controls.addEventListener('start', handleControlStart);
  controls.addEventListener('change', handleControlChange);
  controls.addEventListener('end', handleControlEnd);

  window.addEventListener('click', onClickZ);
  document.getElementById("refreshButton").addEventListener("click", () => location.reload(), false);
}
