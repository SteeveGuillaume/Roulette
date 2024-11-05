import { Raycaster, Vector2, Mesh } from 'three';
import { showChips, hideChips } from './chipCreation.js';

const BOX_SECTION = 18;
const CHIP_DISTANCE_THRESHOLD = 12;
const CHIP_DISTANCE_THRESHOLD_0 = 36;

const POSITION_MAP = {
  "19": { x: (BOX_SECTION * 7) - 9, z: (BOX_SECTION / -2) },
  "20": { x: (BOX_SECTION * 7) - 9, z: (BOX_SECTION * -2) - (BOX_SECTION / -2) },
  "21": { x: (BOX_SECTION * 7) - 9, z: (BOX_SECTION * -3) - (BOX_SECTION / -2) },
  "17": { x: (BOX_SECTION * 6) - 9, z: (BOX_SECTION * -2) - (BOX_SECTION / -2) },
  "23": { x: (BOX_SECTION * 8) - 9, z: (BOX_SECTION * -2) - (BOX_SECTION / -2) }
};

let currentWinningNumberList = [];

export function updateWiningNumberList(winningNumberList) {
  currentWinningNumberList = [];
  currentWinningNumberList = winningNumberList;
}

export function initializeEventHandlers(scene, camera, controls, winningNumberList, pbPositionList) {
  currentWinningNumberList = winningNumberList;
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  let dragging = false;
  let lastMouseX = 0;
  let dialogOpen = false;

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
        const xCondition = Math.abs(node.position.x - boxHit.position.x) > CHIP_DISTANCE_THRESHOLD;
        const zCondition = Math.abs(node.position.z - boxHit.position.z) > (boxHit.name === 'number0' ? CHIP_DISTANCE_THRESHOLD_0 : CHIP_DISTANCE_THRESHOLD);
        
        if (xCondition || zCondition) hideChips(node)
      }
    });
  };

  const setPointerPosition = (event) => {
    pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  };

  const isPlaneGeometry = (object) => {
    return object.geometry.type === "PlaneGeometry" && object.name.includes("number");
  };

  const handleRaycastIntersections = (intersections) => {
    intersections.forEach(intersect => {
      if (isPlaneGeometry(intersect.object)) {
        displayText.innerHTML = currentWinningNumberList[0][intersect.object.name.slice(6)].getText();
        checkSpecialPositions(intersect.object);
        hideOutOfRangeChips(intersect.object);
      }
    });
  };

  const onClickZ = (event) => {
    if (dialogOpen) {
      return;
    }
    if (dragging) {
      dragging = false;
    } else {
      showChips(scene);
      setPointerPosition(event);
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(scene.children, true);
      handleRaycastIntersections(intersections);
    }
  };

  const getMouseX = (e) => e.clientX || e.changedTouches[0].clientX;

  const startRotation = (e) => {
    lastMouseX = getMouseX(e);
  };

  const changeRotation = (e) => {
    dragging = true;
    const currentMouseX = getMouseX(e);
    const deltaX = currentMouseX - lastMouseX;
    checkDirection(currentMouseX);
    lastMouseX = currentMouseX;

    controls.autoRotate = true;
    controls.autoRotateSpeed += deltaX * 0.002;
    stopRotation();
    controls.update();
  };

  const stopRotation = () => {
    setTimeout(() => {
      controls.autoRotate = false;
    }, 100);
  };

  const checkDirection = (currentMouseX) => {
    if (currentMouseX < lastMouseX && controls.autoRotateSpeed > 0) controls.autoRotateSpeed *= -1;
    if (currentMouseX > lastMouseX && controls.autoRotateSpeed < 0) controls.autoRotateSpeed *= -1;
  };

  document.addEventListener('DOMContentLoaded', () => {
    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('change', handleControlChange);
    controls.addEventListener('end', handleControlEnd);
  
    window.addEventListener('click', onClickZ);

    rotateButton.addEventListener("touchstart", startRotation);
    rotateButton.addEventListener("touchmove", changeRotation);
    document.addEventListener('dialogOpened', () => {
      dialogOpen = true;
  });

  document.addEventListener('dialogClosed', () => {
      dialogOpen = false;
  });
  });

}