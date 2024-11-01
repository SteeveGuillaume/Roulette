import { createQuincunx } from './chipCreation.js';
import { initializeNumberList, NUMBER_LIST } from './winningNumberList.js';

const BOX_SECTION = 18;
const HALF_BOX_SECTION = 9;
const COLUMN_MAX = 9;
const CHIP_MAX = 10;

const winningNumberList = initializeNumberList();

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
 * Met à jour la liste des joueurs gagnants en fonction des coordonnées des jetons.
 * @param {object} chipStackObject - L'objet chipStack
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
function updateWinningPlayerList(chipStackObject, winningPlayerList) {
  const numberPlein = getRandomInt(30); //MAX 30
  if (chipStackObject.posX === -HALF_BOX_SECTION) {
    winningPlayerList[0].plein += numberPlein;
    chipStackObject.number = numberPlein;
  } else {
    if (!Number.isInteger(chipStackObject.boxNumber)) {
      if (!Number.isInteger(chipStackObject.columnNumber)) {
        winningPlayerList[NUMBER_LIST[chipStackObject.halfBoxBackwardZ][chipStackObject.halfBoxBackwardX]].plein += numberPlein;
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
  let nbJetons = 0;
  switch(type){
    case 'cheval' : 
      nbJetons = getRandomInt(CHIP_MAX); //MAX 60
      break;
    case 'transversale' : 
      nbJetons = getRandomInt(CHIP_MAX); //MAX 100
      break;
    case 'carre' : 
      nbJetons = getRandomInt(CHIP_MAX); //MAX 120
      break;
    case 'sixain' : 
      nbJetons = getRandomInt(CHIP_MAX); //MAX 250
      break;
  }
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
    updateJetons([transversale, transversale + 1, transversale + 2], 'transversale', chipStackObject, winningPlayerList);
  } else {
    updateJetons([NUMBER_LIST[0][chipStackObject.halfBoxBackwardX], NUMBER_LIST[1][chipStackObject.halfBoxBackwardX]], 'cheval', chipStackObject, winningPlayerList);
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
      updateJetons([NUMBER_LIST[chipStackObject.halfBoxBackwardZ][0], 0], 'cheval', chipStackObject, winningPlayerList);
    } else {
      if (chipStackObject.posZ !== 0) {
        updateJetons([NUMBER_LIST[chipStackObject.boxBackwardZ][chipStackObject.boxNumber], NUMBER_LIST[chipStackObject.columnNumber][chipStackObject.boxNumber], 0], 'transversale', chipStackObject, winningPlayerList);
      } else {
        updateJetons([NUMBER_LIST[0][0], 0], 'cheval', chipStackObject, winningPlayerList);
      }
    }
  } else {
    if (!Number.isInteger(chipStackObject.columnNumber)) {
      updateJetons([NUMBER_LIST[chipStackObject.halfBoxBackwardZ][chipStackObject.boxBackwardX], NUMBER_LIST[chipStackObject.halfBoxBackwardZ][chipStackObject.boxNumber]], 'cheval', chipStackObject, winningPlayerList);
    } else {
      if (chipStackObject.posZ === 0) {
        const sixainFirstLine = NUMBER_LIST[0][chipStackObject.boxBackwardX];
        const sixainIndices = Array.from({ length: 6 }, (_, i) => i + sixainFirstLine);
        updateJetons(sixainIndices, 'sixain', chipStackObject, winningPlayerList);
      } else {
        updateJetons([
          NUMBER_LIST[chipStackObject.boxBackwardZ][chipStackObject.boxBackwardX], 
          NUMBER_LIST[chipStackObject.columnNumber][chipStackObject.boxBackwardX], 
          NUMBER_LIST[chipStackObject.boxBackwardZ][chipStackObject.boxNumber], 
          NUMBER_LIST[chipStackObject.columnNumber][chipStackObject.boxNumber]
        ], 'carre', chipStackObject, winningPlayerList);
      }
    }
  }
}

/**
 * Handles the special case where axeX is at the maximum column.
 * @param {number} axeX - The X coordinate.
 * @param {number} axeZ - The Z coordinate.
 * @returns {object} The adjusted coordinates.
 */
function handleSpecialCase(axeX, axeZ) {
  if (axeX === (COLUMN_MAX - 1) * HALF_BOX_SECTION) {
    return { axeX: -9, axeZ: 27 };
  }
  return { axeX, axeZ };
}

/**
 * Crée les piles de jetons initiales.
 */
function createInitialChipStacks() {
  const randMax = getRandomInt(30);
  for (let index = 0; index < randMax; index++) {
    let axeX = getRandomInt(COLUMN_MAX) * HALF_BOX_SECTION;
    let axeZ = getRandomInt(6) * HALF_BOX_SECTION;
    ({ axeX, axeZ } = handleSpecialCase(axeX, axeZ));
    createChipStackObject(axeX, axeZ, winningNumberList[0]);
  }
}

/**
 * Initialise les piles de jetons et crée les quincunxes.
 * @param {object} scene - La scène Three.js.
 * @returns {array} La liste des numéros gagnants mise à jour.
 */
export function initializeChipStack(scene) {
  createInitialChipStacks();
  chipStackList.forEach(element => {
    createQuincunx(element.number, element.posX, element.posZ, 0, scene);
  });
  return winningNumberList;
}

/**
 * Renvoie un entier aléatoire compris entre 0 et max-1.
 * @param {number} max - La valeur maximale.
 * @returns {number} Un entier aléatoire.
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}