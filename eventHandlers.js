import { Raycaster, Vector2, Mesh, MathUtils } from 'three';
import { showChips, hideChips } from './chipVisibility.js';
import { DialogHitHandlers } from './dialogHitHandlers.js';

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
  let dialogOpen = false;
  const dialogHitHandlers = new DialogHitHandlers();

  const handleControlStart = () => dragging = true;
  const handleControlChange = () => {
    if (!dragging) showChips(scene);
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
        const text = currentWinningNumberList[0][intersect.object.name.slice(6)].getText();
        dialogHitHandlers.showDialog(text); // Show the dialog
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

  document.addEventListener('DOMContentLoaded', () => {
    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('change', handleControlChange);
    controls.addEventListener('end', handleControlEnd);
  
    window.addEventListener('click', onClickZ);

    document.addEventListener('dialogOpened', () => {
      dialogOpen = true;
    });
    document.addEventListener('dialogClosed', () => {
        dialogOpen = false;
    });
  });

}