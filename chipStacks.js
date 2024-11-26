import { createQuincunx, clearChipStackList } from './chipStackManagement.js';
import { initializeNumberList, NUMBER_LIST } from './numberList.js';
import { initializeSliderValues, getCheckboxStates, getTwoPlayersState } from './settingsValue.js';
import { updateWinningPlayerList } from './winningPlayerList.js';

const BOX_SECTION = 18;
const HALF_BOX_SECTION = 9;

let sliderValues = {};

export { sliderValues, NUMBER_LIST };

const chipStackTemplate = {
  name: "",
  posX: undefined,
  posZ: undefined,
  number: undefined,
  halfBoxBackwardX: undefined,
  halfBoxBackwardZ: undefined,
  boxBackwardX: undefined,
  boxBackwardZ: undefined,
  boxNumber: undefined,
  columnNumber: undefined
};

let chipStackList = [];
let winningNumberList = [];

/**
 * Crée un objet représentant une pile de jetons avec ses coordonnées et le nombre de jetons.
 * Met à jour la liste des joueurs gagnants en fonction des coordonnées des jetons.
 * @param {number} axeX - La coordonnée X.
 * @param {number} axeZ - La coordonnée Z.
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
function createChipStackObject(axeX, axeZ) {
  const chipStackObject = { 
    ...chipStackTemplate, 
    name: `${axeX}-${axeZ}`, 
    posX: axeX, 
    posZ: axeZ,
    halfBoxBackwardX: (axeX - HALF_BOX_SECTION) / BOX_SECTION,
    halfBoxBackwardZ: (axeZ - HALF_BOX_SECTION) / BOX_SECTION,
    boxBackwardX: (axeX - BOX_SECTION) / BOX_SECTION,
    boxBackwardZ: (axeZ - BOX_SECTION) / BOX_SECTION,
    boxNumber: axeX / BOX_SECTION,
    columnNumber: axeZ / BOX_SECTION
  };
  
  if (!chipStackList.find(({ name }) => name === chipStackObject.name)) {
    chipStackList.push(chipStackObject);
  }
}

/**
 * Return the number of chips for a given type.
 * @param {number} min - La valeur minimale.
 * @param {number} max - La valeur maximale.
 * @returns {number} The adjusted coordinates.
 */
export function getnumberChips(type, min, max) {
  const checkboxStates = getCheckboxStates();
  let chips = 0;

  Object.entries(checkboxStates).forEach(([id, checked]) => {
      if (id.includes(type) && checked) {
          chips = getRandomIntInRange(min, max);
      }
  });

  return chips;
}

/**
 * Handles the case for zero where axeX is at the maximum column.
 * @param {number} axeX - The X coordinate.
 * @param {number} axeZ - The Z coordinate.
 * @returns {object} The adjusted coordinates.
 */
function handleZeroCase(axeX, axeZ) {
  if (axeX === (sliderValues.nbColumn - 1) * HALF_BOX_SECTION) {
    return { axeX: -9, axeZ: 27 };
  }
  return { axeX, axeZ };
}

/**
 * Crée les piles de jetons initiales.
 */
function createInitialChipStacks(scene) {
  const randMax = getRandomIntInRange(1, sliderValues.max);
  for (let index = 0; index < randMax; index++) {
    let axeX = getRandomIntInRange(0, sliderValues.nbColumn) * HALF_BOX_SECTION;
    let axeZ = getRandomIntInRange(0, 6) * HALF_BOX_SECTION;
    ({ axeX, axeZ } = handleZeroCase(axeX, axeZ));
    createChipStackObject(axeX, axeZ);
  }
  createChipStacks(chipStackList, scene);
}

/**
 * Crée les ChipStacks
 * @param {array} chipStackList - Liste des piles de jetons
 * @param {boolean} players - Si plusieurs joueurs sont impliqués
 * @param {object} scene - La scène Three.js
 */
function createChipStacks(chipStackList, scene) {
  winningNumberList = initializeNumberList();
  chipStackList.forEach(chipStack => {
    if (getTwoPlayersState()) {
      const oldChipStack = { ...chipStack };
      const randomInt = Math.floor(Math.random() * chipStack.number);
      const maxInt = Math.max(chipStack.number - randomInt, randomInt);
      chipStack.number = maxInt;
      oldChipStack.number -= maxInt;
      updateWinningPlayerList(chipStack, winningNumberList[0]);
      updateWinningPlayerList(oldChipStack, winningNumberList[1]);
      const finalHeight = createQuincunx(chipStack, 0, false, scene);
      createQuincunx(oldChipStack, finalHeight, true, scene);
    } else {
      updateWinningPlayerList(chipStack, winningNumberList[0]);
      createQuincunx(chipStack, 0, false, scene);
    }
  });
}

/**
 * Initialise les piles de jetons et crée les quincunxes.
 * @param {object} scene - La scène Three.js.
 * @returns {array} La liste des numéros gagnants mise à jour.
 */
export function initializeChipStack(scene) {
  clearChipStack(scene);
  sliderValues = initializeSliderValues();
  createInitialChipStacks(scene);
  return winningNumberList;
}

/**
 * Réinitialise les piles de jetons et crée les quincunxes.
 * @param {object} scene - La scène Three.js.
 */
function clearChipStack(scene){
  clearChipStackList(scene);
  chipStackList = [];
  winningNumberList = [];
  sliderValues = {};
}

/**
 * Renvoie un entier aléatoire compris entre min et max (inclus).
 * @param {number} min - La valeur minimale.
 * @param {number} max - La valeur maximale.
 * @returns {number} Un entier aléatoire compris entre min et max.
 */
function getRandomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}