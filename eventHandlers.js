import { Raycaster, Vector2, Mesh, MathUtils } from 'three';
import { showChips, hideChips } from './chipVisibility.js';
import { DialogHitHandlers } from './dialogHitHandlers.js';
import { getTwoPlayersState } from './settingsValue.js';

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
let currentPbPositionList = [];

export function updateDataList(winningNumberList, pbPositionList) {
  currentWinningNumberList = [];
  currentWinningNumberList = winningNumberList;
  currentPbPositionList = [];
  currentPbPositionList = pbPositionList;
}

export function initializeEventHandlers(scene, camera, controls, winningNumberList, pbPositionList) {
  currentWinningNumberList = winningNumberList;
  currentPbPositionList = pbPositionList;
  const raycaster = new Raycaster();
  const pointer = new Vector2();
  let dragging = false;
  let lastClickedObject = null;
  const dialogHitHandlers = new DialogHitHandlers();

  const handleControlStart = () => dragging = true;
  const handleControlChange = () => dragging = true;
  const handleControlEnd = () => dragging = false;

  const checkPictureBetsPositions = (boxHit) => {
    const position = Object.entries(POSITION_MAP).find(([_, pos]) => 
      boxHit.position.x === pos.x && boxHit.position.z === pos.z
    );
    return position;
  };

  const hideOutOfRangeChips = (boxHit) => {
    const threshold = boxHit.name === 'number0' ? CHIP_DISTANCE_THRESHOLD_0 : CHIP_DISTANCE_THRESHOLD;
  
    scene.traverse(node => {
      if (!(node instanceof Mesh) || node.geometry.type !== "CylinderGeometry") return;
  
      const xDiff = Math.abs(node.position.x - boxHit.position.x);
      const zDiff = Math.abs(node.position.z - boxHit.position.z);
      
      if (
        (xDiff > CHIP_DISTANCE_THRESHOLD || zDiff > threshold) &&
        !(xDiff <= CHIP_DISTANCE_THRESHOLD && node.position.z === 0)
      ) {
        hideChips(node);
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
        const total = currentWinningNumberList[0][intersect.object.name.slice(6)].getAllTotal();
        const pictureBet = checkPictureBetsPositions(intersect.object);
        const boxValue = pictureBet ? currentPbPositionList[`box${pictureBet[0]}`] : 0;
        const isPictureBet = pictureBet && boxValue !== 0 && boxValue !== undefined;
        if (lastClickedObject === intersect.object) {
          if(!isPictureBet && total > 0) {
            const objectName = intersect.object.name.slice(6);
            let text = currentWinningNumberList[0][objectName].getText();
            if(getTwoPlayersState()) {
              const text2 = currentWinningNumberList[1][objectName].getText();
              text =  `Joueur 1 : <br> ${text} <br> Joueur 2 : <br> ${text2}`;
            }
            dialogHitHandlers.showDialog('Number Details', text);
          }
          if (isPictureBet) {
            const notification = document.getElementById('notification');
            notification.innerText = `${boxValue.replace(/[^\d]/g, '')}`;
            notification.style.display = 'block';
            setTimeout(() => {
              notification.style.display = 'none';
            }, 3000);
          }
          lastClickedObject = null;
        }
        lastClickedObject = intersect.object;
        if (total > 0  || isPictureBet) hideOutOfRangeChips(intersect.object);
      }
    });
  };

  const onClickZ = (event) => {
    if (dragging) return;
      showChips(scene);
      setPointerPosition(event);
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(scene.children, true);
      handleRaycastIntersections(intersections);
  };

  document.addEventListener('DOMContentLoaded', () => {
    controls.addEventListener('start', handleControlStart);
    controls.addEventListener('change', handleControlChange);
    controls.addEventListener('end', handleControlEnd);
  
    window.addEventListener('click', onClickZ);

    document.addEventListener('dialogOpened', () => {
      dragging = true;
    });
    document.addEventListener('dialogClosed', () => {
    });
  });

}