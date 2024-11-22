import { createChip } from './chipCreation.js';
import { DEFAULT_CHIP_ATTRIBUTE } from './chipGeometry.js';
let currentChipStackList = [];

/**
 * Crée les ChipStacks
 * @param {array} chipStackList - Liste des piles de jetons
 * @param {boolean} players - Si plusieurs joueurs sont impliqués
 * @param {object} scene - La scène Three.js
 */
export function createChipStacks(chipStackList, players, scene) {
  chipStackList.forEach(chipStack => {
    if (players) {
      const oldChipStack = { ...chipStack };
      const randomInt = Math.floor(Math.random() * chipStack.number);
      const maxInt = Math.max(chipStack.number - randomInt, randomInt);
      chipStack.number = maxInt;
      oldChipStack.number -= maxInt;
      const finalHeight = createQuincunx(chipStack, 0, false, scene);
      createQuincunx(oldChipStack, finalHeight, true, scene);
    } else {
      createQuincunx(chipStack, 0, false, scene);
    }
  });
}

/**
 * Crée un quincunx de jetons
 * @param {array} chipStackList - Liste des piles de jetons
 * @param {number} currentHeight - Hauteur actuelle de la pile
 * @param {object} scene - La scène Three.js
 */
function createQuincunx(chipStack, initialHeight, isGrayChip, scene) {
    const { posX, posZ, number } = chipStack;
    let currentHeight = initialHeight;
    const nbColumns = Math.floor(number / 5);
    const totalHeight = number + currentHeight;
    let step = 4;
    let switchColumn = false;
    const adjustedPosX = posX - (isGrayChip ? 0 : parseFloat(step / 10) * 2);

    for (let i = 0; i < nbColumns; i++) {
      for (let j = 0; j < 5; j++) {
        if (j === 0) switchColumn = !switchColumn;
        createChipAtPosition(switchColumn, adjustedPosX, posZ, currentHeight, step, isGrayChip, scene);
        currentHeight++;
      }
    }

    // Inverser la direction du step pour les jetons restants
    //step = -step;
    switchColumn = !switchColumn;

    while (currentHeight < totalHeight) {
      createChipAtPosition(switchColumn, adjustedPosX, posZ, currentHeight, step, isGrayChip, scene);
      currentHeight++;
      step -= 3; // Continuer dans la direction opposée
    }

  return currentHeight;
}

/**
 * Crée un jeton à une position donnée
 * @param {boolean} switchColumn - Indicateur de changement de colonne
 * @param {number} posX - Position X initiale
 * @param {number} posZ - Position Z initiale
 * @param {number} currentHeight - Hauteur actuelle de la pile
 * @param {number} step - Étape de changement de position
 * @param {boolean} isGrayChip - Indicateur de la couleur du jeton
 * @param {object} scene - La scène Three.js
 */
function createChipAtPosition(switchColumn, posX, posZ, currentHeight, step, isGrayChip, scene) {
  const baseStep = parseFloat(step / 10);
  const adjustedPosX = posX + (switchColumn ? baseStep : -baseStep - 0.6);
  const posY = (currentHeight + 1) * DEFAULT_CHIP_ATTRIBUTE.height;
  const chip = createChip(adjustedPosX, posY, posZ, isGrayChip, scene);
  currentChipStackList.push(chip);
}

/**
 * Nettoie la liste des jetons en les supprimant de la scène
 * @param {object} scene - La scène Three.js
 */
export function clearChipStackList(scene) {
    for (let chip of currentChipStackList) {
        scene.remove(chip); // Enlever le jeton de la scène
    }
    // Vider le tableau des jetons créés
    currentChipStackList = [];
  }