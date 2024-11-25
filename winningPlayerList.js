import { getnumberChips, sliderValues, NUMBER_LIST } from './chipStacks.js';

const HALF_BOX_SECTION = 9;

const BET_TYPES = {
    PLEIN: 'plein',
    CHEVAL: 'cheval',
    TRANSVERSALE: 'transversale',
    CARRE: 'carre',
    SIXAIN: 'sixain'
  };

/**
 * Met à jour la liste des joueurs gagnants en fonction des coordonnées des jetons.
 * @param {object} chipStackObject - L'objet chipStack
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
export function updateWinningPlayerList(chipStackObject, winningPlayerList) {
  const numberPlein = getnumberChips(BET_TYPES.PLEIN, sliderValues[BET_TYPES.PLEIN][0], sliderValues[BET_TYPES.PLEIN][1]);
  const indices = [0]; // Définir les indices des joueurs gagnants
  const type = BET_TYPES.PLEIN; // Définir le type de mise à jour

  if (chipStackObject.posX === -HALF_BOX_SECTION) {
    updateChips(indices, type, chipStackObject, winningPlayerList);
  } else {
    if (!Number.isInteger(chipStackObject.boxNumber)) {
      if (!Number.isInteger(chipStackObject.columnNumber)) {
        const index = NUMBER_LIST[chipStackObject.halfBoxBackwardZ][chipStackObject.halfBoxBackwardX];
        updateChips([index], type, chipStackObject, winningPlayerList);
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
function updateChips(indices, type, chipStackObject, winningPlayerList) {
    const nbJetons = getnumberChips(type, sliderValues[type][0], sliderValues[type][1]);

    indices.forEach(index => {
      winningPlayerList[index][type] += nbJetons;
      chipStackObject.number = nbJetons;
    });
}

/**
 * Met à jour la liste des joueurs gagnants pour une colonne.
 * @param {object} chipStackObject - L'objet chipStack
 * @param {array} winningPlayerList - La liste des joueurs gagnants.
 */
function updateWinningListForColumn(chipStackObject, winningPlayerList) {
  if (chipStackObject.posZ === 0) {
    const transversale = NUMBER_LIST[0][chipStackObject.halfBoxBackwardX];
    updateChips([transversale, transversale + 1, transversale + 2], BET_TYPES.TRANSVERSALE, chipStackObject, winningPlayerList);
  } else {
    updateChips([NUMBER_LIST[0][chipStackObject.halfBoxBackwardX], NUMBER_LIST[1][chipStackObject.halfBoxBackwardX]], BET_TYPES.CHEVAL, chipStackObject, winningPlayerList);
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
      updateChips([NUMBER_LIST[chipStackObject.halfBoxBackwardZ][0], 0], BET_TYPES.CHEVAL, chipStackObject, winningPlayerList);
    } else {
      if (chipStackObject.posZ !== 0) {
        updateChips([NUMBER_LIST[chipStackObject.boxBackwardZ][chipStackObject.boxNumber], NUMBER_LIST[chipStackObject.columnNumber][chipStackObject.boxNumber], 0], BET_TYPES.TRANSVERSALE, chipStackObject, winningPlayerList);
      } else {
        updateChips([ 0, 1, 2, 3 ], BET_TYPES.CARRE, chipStackObject, winningPlayerList);
      }
    }
  } else {
    if (!Number.isInteger(chipStackObject.columnNumber)) {
      updateChips([NUMBER_LIST[chipStackObject.halfBoxBackwardZ][chipStackObject.boxBackwardX], NUMBER_LIST[chipStackObject.halfBoxBackwardZ][chipStackObject.boxNumber]], BET_TYPES.CHEVAL, chipStackObject, winningPlayerList);
    } else {
      if (chipStackObject.posZ === 0) {
        const sixainFirstLine = NUMBER_LIST[0][chipStackObject.boxBackwardX];
        const sixainIndices = Array.from({ length: 6 }, (_, i) => i + sixainFirstLine);
        updateChips(sixainIndices, BET_TYPES.SIXAIN, chipStackObject, winningPlayerList);
      } else {
        updateChips([
          NUMBER_LIST[chipStackObject.boxBackwardZ][chipStackObject.boxBackwardX], 
          NUMBER_LIST[chipStackObject.columnNumber][chipStackObject.boxBackwardX], 
          NUMBER_LIST[chipStackObject.boxBackwardZ][chipStackObject.boxNumber], 
          NUMBER_LIST[chipStackObject.columnNumber][chipStackObject.boxNumber]
        ], BET_TYPES.CARRE, chipStackObject, winningPlayerList);
      }
    }
  }
}