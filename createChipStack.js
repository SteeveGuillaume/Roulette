import { createQuincunx} from './chipCreation.js';
import { initializeNumberList, NUMBER_LIST} from './winningNumberList.js';

const BOX_SECTION = 18;
const HALF_BOX_SECTION = 9;
const COLUMN_MAX = 9;

const winningNumberList = initializeNumberList();

const chipStackTemplate = {
  name: "",
  posX: undefined,
  posZ: undefined,
  number: undefined
};

let chipStackList = [];

/**
 * Crée un objet représentant une pile de jetons avec ses coordonnées et le nombre de jetons.
 * Met à jour la liste des joueurs gagnants en fonction des coordonnées des jetons.
 * @param {number} axeX - La coordonnée X.
 * @param {number} axeZ - La coordonnée Z.
 * @param {number} nbJetons - Le nombre de jetons.
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 * @returns {object} Un objet représentant une pile de jetons.
 */
function createChipStackObject(axeX, axeZ, nbJetons, winningPlayerList) {
  const chipStackObject = { ...chipStackTemplate, posX: axeX, posZ: axeZ, number: nbJetons };
  if(axeX === (COLUMN_MAX - 1) * HALF_BOX_SECTION){ //Cas du zéro
    chipStackObject.name = "-9-27";
    chipStackObject.posX = -9;
    chipStackObject.posZ = 27;
  } else {
    chipStackObject.name = `${axeX}-${axeZ}`;
  }
  updateWinningPlayerList(axeX, axeZ, nbJetons, winningPlayerList);
  return chipStackObject;
}

/**
 * Met à jour la liste des joueurs gagnants en fonction des coordonnées des jetons.
 * @param {number} axeX - La coordonnée X.
 * @param {number} axeZ - La coordonnée Z.
 * @param {number} nbJetons - Le nombre de jetons.
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
function updateWinningPlayerList(axeX, axeZ, nbJetons, winningPlayerList) {
  if (axeX === (COLUMN_MAX - 1) * HALF_BOX_SECTION) {
    winningPlayerList[0].plein += nbJetons;
  } else {
    const halfBoxBckwdX = ((axeX - HALF_BOX_SECTION) / BOX_SECTION);
    const halfBoxBckwdZ = ((axeZ - HALF_BOX_SECTION) / BOX_SECTION);
    const boxBckwdX = ((axeX - BOX_SECTION) / BOX_SECTION);
    const boxBckwdZ = ((axeZ - BOX_SECTION) / BOX_SECTION);
    const boxNumber = axeX / BOX_SECTION;
    const columnNumber = axeZ / BOX_SECTION;

    if (!Number.isInteger(boxNumber)) {
      if (!Number.isInteger(columnNumber)) {
        winningPlayerList[NUMBER_LIST[halfBoxBckwdZ][halfBoxBckwdX]].plein += nbJetons;
      } else {
        updateWinningListForColumn(axeZ, nbJetons, halfBoxBckwdX, winningPlayerList);
      }
    } else {
      updateWinningListForBox(axeX, axeZ, nbJetons, halfBoxBckwdZ, halfBoxBckwdX, boxBckwdX, boxBckwdZ, boxNumber, columnNumber, winningPlayerList);
    }
  }
}
/**
 * Met à jour les jetons pour les joueurs gagnants.
 * @param {array} indices - Les indices des joueurs.
 * @param {string} type - Le type de mise à jour (cheval, transversale, carre, sixain).
 * @param {number} nbJetons - Le nombre de jetons.
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
const updateJetons = (indices, type, nbJetons, winningPlayerList) => {
  indices.forEach(index => {
    winningPlayerList[index][type] += nbJetons;
  });
};

/**
 * Met à jour la liste des joueurs gagnants pour une colonne.
 * @param {number} axeZ - La coordonnée Z.
 * @param {number} nbJetons - Le nombre de jetons.
 * @param {number} halfBoxBckwdX - La coordonnée X ajustée.
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
function updateWinningListForColumn(axeZ, nbJetons, halfBoxBckwdX, winningPlayerList) {
  if (axeZ === 0) {
    const transversale = NUMBER_LIST[0][halfBoxBckwdX];
    updateJetons([transversale, transversale + 1, transversale + 2], 'transversale', nbJetons, winningPlayerList);
  } else {
    updateJetons([NUMBER_LIST[0][halfBoxBckwdX], NUMBER_LIST[1][halfBoxBckwdX]], 'cheval', nbJetons, winningPlayerList);
  }
}

/**
 * Met à jour la liste des joueurs gagnants pour une boîte.
 * @param {number} axeX - La coordonnée X.
 * @param {number} axeZ - La coordonnée Z.
 * @param {number} nbJetons - Le nombre de jetons.
 * @param {number} halfBoxBckwdZ - La coordonnée Z ajustée.
 * @param {number} halfBoxBckwdX - La coordonnée X ajustée.
 * @param {number} boxBckwdX - La coordonnée X de la boîte.
 * @param {number} boxBckwdZ - La coordonnée Z de la boîte.
 * @param {number} boxNumber - Le numéro de la boîte.
 * @param {number} columnNumber - Le numéro de la colonne.
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
function updateWinningListForBox(axeX, axeZ, nbJetons, halfBoxBckwdZ, halfBoxBckwdX, boxBckwdX, boxBckwdZ, boxNumber, columnNumber, winningPlayerList) {
  if (axeX === 0) {
    if (!Number.isInteger(columnNumber)) {
      updateJetons([NUMBER_LIST[halfBoxBckwdZ][0], 0], 'cheval', nbJetons, winningPlayerList);
    } else {
      if (axeZ !== 0) {
        updateJetons([NUMBER_LIST[boxBckwdZ][boxNumber], NUMBER_LIST[columnNumber][boxNumber], 0], 'transversale', nbJetons, winningPlayerList);
      } else {
        updateJetons([NUMBER_LIST[0][0], 0], 'cheval', nbJetons, winningPlayerList);
      }
    }
  } else {
    if (!Number.isInteger(columnNumber)) {
      updateJetons([NUMBER_LIST[halfBoxBckwdZ][boxBckwdX], NUMBER_LIST[halfBoxBckwdZ][boxNumber]], 'cheval', nbJetons, winningPlayerList);
    } else {
      if (axeZ === 0) {
        const sixainFirstLine = NUMBER_LIST[0][boxBckwdX];
        const sixainIndices = Array.from({ length: 6 }, (_, i) => i + sixainFirstLine);
        updateJetons(sixainIndices, 'sixain', nbJetons, winningPlayerList);
      } else {
        updateJetons([
          NUMBER_LIST[boxBckwdZ][boxBckwdX], 
          NUMBER_LIST[columnNumber][boxBckwdX], 
          NUMBER_LIST[boxBckwdZ][boxNumber], 
          NUMBER_LIST[columnNumber][boxNumber]
        ], 'carre', nbJetons, winningPlayerList);
      }
    }
  }
}

/**
 * Crée les piles de jetons initiales.
 */
function createInitialChipStacks() {
  const randMax = getRandomInt(30);
  for (let index = 0; index < randMax; index++) {
    const axeX = getRandomInt(COLUMN_MAX) * HALF_BOX_SECTION;
    const axeZ = getRandomInt(6) * HALF_BOX_SECTION;
    const nbJetons = getRandomInt(30);

    if (nbJetons !== 0) {
      const chipStackObject = createChipStackObject(axeX, axeZ, nbJetons, winningNumberList[0]);
      const isDoublon = chipStackList.find(({ name }) => name === chipStackObject.name);

      if (!isDoublon) {
        chipStackList.push(chipStackObject);
      }
    }
  }
}

export function initializeChipStack(scene) {
    // Initialisation des piles de jetons et gestion des doublons
    createInitialChipStacks(scene);

    // Création des quincunxes pour les piles de jetons
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