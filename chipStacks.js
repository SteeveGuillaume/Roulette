import { createChipStacks, clearChipStackList } from './chipStackManagement.js';
import { initializeNumberList, NUMBER_LIST } from './numberList.js';
import { sliders, getCurrentSliderValues, getCheckboxStates, getTwoPlayersState } from './settingsValue.js';

const BOX_SECTION = 18;
const HALF_BOX_SECTION = 9;

let sliderValues = {};

const BET_TYPES = {
  PLEIN: 'plein',
  CHEVAL: 'cheval',
  TRANSVERSALE: 'transversale',
  CARRE: 'carre',
  SIXAIN: 'sixain'
};

/**
 * Initialise les valeurs des sliders à partir des sliders définis.
 */
function initializeSliderValues() {
  const currentSliderValues = getCurrentSliderValues();
  sliderValues = sliders.reduce((acc, slider) => {
    const { id } = slider;
    const key = id.replace('Slider', '');
    acc[key] = currentSliderValues[id];
    return acc;
  }, {});
}

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
function createChipStackObject(axeX, axeZ, winningPlayerList) {
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
    updateWinningPlayerList(chipStackObject, winningPlayerList);
    chipStackList.push(chipStackObject);
  }
}


/**
 * Return the number of chips for a given type.
 * @param {number} min - La valeur minimale.
 * @param {number} max - La valeur maximale.
 * @returns {number} The adjusted coordinates.
 */
function getnumberChips(type, min, max) {
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
 * Met à jour la liste des joueurs gagnants en fonction des coordonnées des jetons.
 * @param {object} chipStackObject - L'objet chipStack
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
function updateWinningPlayerList(chipStackObject, winningPlayerList) {
  const numberPlein = getnumberChips(BET_TYPES.PLEIN, sliderValues[BET_TYPES.PLEIN][0], sliderValues[BET_TYPES.PLEIN][1]);
  if (chipStackObject.posX === -HALF_BOX_SECTION) {
    winningPlayerList[0][BET_TYPES.PLEIN] += numberPlein;
    chipStackObject.number = numberPlein;
  } else {
    if (!Number.isInteger(chipStackObject.boxNumber)) {
      if (!Number.isInteger(chipStackObject.columnNumber)) {
        winningPlayerList[NUMBER_LIST[chipStackObject.halfBoxBackwardZ][chipStackObject.halfBoxBackwardX]][BET_TYPES.PLEIN] += numberPlein;
        chipStackObject.number = numberPlein;
      } else {
        updateWinningListForColumn(chipStackObject, winningPlayerList);
      }
    } else {
      updateWinningListForBox(chipStackObject, winningPlayerList);
    }
  }
}

/**
 * Met à jour les jetons pour les joueurs gagnants.
 * @param {array} indices - Les indices des joueurs.
 * @param {string} type - Le type de mise à jour (cheval, transversale, carre, sixain).
 * @param {object} chipStackObject - L'objet chipStack
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
const updateJetons = (indices, type, chipStackObject, winningPlayerList) => {
    // Utiliser la valeur de sliderValues directement en fonction du type
    const nbJetons = getnumberChips(type, sliderValues[type][0], sliderValues[type][1]);

    // Utiliser forEach pour mettre à jour les valeurs
    indices.forEach(index => {
      winningPlayerList[index][type] += nbJetons;
      chipStackObject.number = nbJetons;
    });
};

/**
 * Met à jour la liste des joueurs gagnants pour une colonne.
 * @param {object} chipStackObject - L'objet chipStack
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
function updateWinningListForColumn(chipStackObject, winningPlayerList) {
  if (chipStackObject.posZ === 0) {
    const transversale = NUMBER_LIST[0][chipStackObject.halfBoxBackwardX];
    updateJetons([transversale, transversale + 1, transversale + 2], BET_TYPES.TRANSVERSALE, chipStackObject, winningPlayerList);
  } else {
    updateJetons([NUMBER_LIST[0][chipStackObject.halfBoxBackwardX], NUMBER_LIST[1][chipStackObject.halfBoxBackwardX]], BET_TYPES.CHEVAL, chipStackObject, winningPlayerList);
  }
}

/**
 * Met à jour la liste des joueurs gagnants pour une boîte.
 * @param {object} chipStackObject - L'objet chipStack
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
function updateWinningListForBox(chipStackObject, winningPlayerList) {
  if (chipStackObject.posX === 0) {
    if (!Number.isInteger(chipStackObject.columnNumber)) {
      updateJetons([NUMBER_LIST[chipStackObject.halfBoxBackwardZ][0], 0], BET_TYPES.CHEVAL, chipStackObject, winningPlayerList);
    } else {
      if (chipStackObject.posZ !== 0) {
        updateJetons([NUMBER_LIST[chipStackObject.boxBackwardZ][chipStackObject.boxNumber], NUMBER_LIST[chipStackObject.columnNumber][chipStackObject.boxNumber], 0], BET_TYPES.TRANSVERSALE, chipStackObject, winningPlayerList);
      } else {
        updateJetons([ 0, 1, 2, 3 ], BET_TYPES.CARRE, chipStackObject, winningPlayerList);
      }
    }
  } else {
    if (!Number.isInteger(chipStackObject.columnNumber)) {
      updateJetons([NUMBER_LIST[chipStackObject.halfBoxBackwardZ][chipStackObject.boxBackwardX], NUMBER_LIST[chipStackObject.halfBoxBackwardZ][chipStackObject.boxNumber]], BET_TYPES.CHEVAL, chipStackObject, winningPlayerList);
    } else {
      if (chipStackObject.posZ === 0) {
        const sixainFirstLine = NUMBER_LIST[0][chipStackObject.boxBackwardX];
        const sixainIndices = Array.from({ length: 6 }, (_, i) => i + sixainFirstLine);
        updateJetons(sixainIndices, BET_TYPES.SIXAIN, chipStackObject, winningPlayerList);
      } else {
        updateJetons([
          NUMBER_LIST[chipStackObject.boxBackwardZ][chipStackObject.boxBackwardX], 
          NUMBER_LIST[chipStackObject.columnNumber][chipStackObject.boxBackwardX], 
          NUMBER_LIST[chipStackObject.boxBackwardZ][chipStackObject.boxNumber], 
          NUMBER_LIST[chipStackObject.columnNumber][chipStackObject.boxNumber]
        ], BET_TYPES.CARRE, chipStackObject, winningPlayerList);
      }
    }
  }
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
function createInitialChipStacks(winningNumberList) {
  const randMax = getRandomIntInRange(0, sliderValues.max);
  for (let index = 0; index < randMax; index++) {
    let axeX = getRandomIntInRange(0, sliderValues.nbColumn) * HALF_BOX_SECTION;
    let axeZ = getRandomIntInRange(0, 6) * HALF_BOX_SECTION;
    ({ axeX, axeZ } = handleZeroCase(axeX, axeZ));
    createChipStackObject(axeX, axeZ, winningNumberList[0]);
  }
}

/**
 * Initialise les piles de jetons et crée les quincunxes.
 * @param {object} scene - La scène Three.js.
 * @returns {array} La liste des numéros gagnants mise à jour.
 */
export function initializeChipStack(scene) {
  clearChipStack(scene);
  initializeSliderValues();
  winningNumberList = initializeNumberList();
  createInitialChipStacks(winningNumberList);
  createChipStacks(chipStackList, getTwoPlayersState(), scene);
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