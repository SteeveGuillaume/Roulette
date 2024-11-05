// chipCreation.js

import { Mesh, MeshBasicMaterial } from 'three';
import { chipMaterialGray, chipMaterialRed } from './chipTextures.js';
import { createCylinderGeometry, DEFAULT_CHIP_ATTRIBUTE } from './chipGeometry.js';

let currentChipStackList = [];
let currentPictureBetsList = [];

/**
 * Crée un quincunx de jetons
 * @param {array} chipList - Liste des jetons
 * @param {number} startX - La position X 
 * @param {number} startY - La position Y 
 * @param {object} scene - La scène Three.js
 */
function createPictureBets(chipList, posX, posY, scene) {
  chipList.forEach(chip => {
    let pictureBet = createChip((chip[0] * 9) + posX, 0, (chip[1] * 9) + posY, false, scene);
    currentPictureBetsList.push(pictureBet);
  });
}

/**
 * Crée les ChipStacks
 * @param {array} chipStackList - Liste des piles de jetons
 * @param {boolean} players - Si plusieurs joueurs sont impliqués
 * @param {object} scene - La scène Three.js
 */
function createChipStacks(chipStackList, players, scene) {
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
    let step = 3;
    let switchColumn = false;

    for (let i = 0; i < nbColumns; i++) {
      for (let j = 0; j < 5; j++) {
        if (j === 0) switchColumn = !switchColumn;
        createChipAtPosition(switchColumn, posX, posZ, currentHeight, step, isGrayChip, scene);
        currentHeight++;
      }
    }

    // Inverser la direction du step pour les jetons restants
    //step = -step;
    switchColumn = !switchColumn;

    while (currentHeight < totalHeight) {
      createChipAtPosition(switchColumn, posX, posZ, currentHeight, step, isGrayChip, scene);
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
  const adjustedPosZ = posZ - (isGrayChip ? 0 : baseStep * 2);
  const posY = (currentHeight + 1) * DEFAULT_CHIP_ATTRIBUTE.height;
  const chip = createChip(adjustedPosX, posY, adjustedPosZ, isGrayChip, scene);
  currentChipStackList.push(chip);
}

/**
 * Crée un jeton avec des matériaux et une position donnés
 * @param {number} posX - Position X du jeton
 * @param {number} posY - Position Y du jeton
 * @param {number} posZ - Position Z du jeton
 * @param {boolean} isGray - Indicateur de la couleur du jeton
 * @param {object} scene - La scène Three.js
 */
function createChip(posX, posY, posZ, isGray, scene) {
  const material = isGray ? chipMaterialGray : chipMaterialRed;
  const chip = new Mesh(new createCylinderGeometry(), material);
  chip.name = `chip-${posZ}/${posX}/${posY}/${isGray}`;
  chip.position.set(posX, posY, -posZ);
  scene.add(chip);
  return chip;
}

/**
 * Cache un jeton en le rendant transparent
 * @param {object} chip - Jeton à cacher
 */
function hideChips(chip) {
  const transparentMaterial = new MeshBasicMaterial({ color: 0xffffff });
  transparentMaterial.transparent = true;
  transparentMaterial.opacity = 0;
  chip.material = transparentMaterial;
}

/**
 * Affiche les jetons en restaurant leur matériau d'origine
 * @param {object} scene - La scène Three.js
 */
function showChips(scene) {
  scene.traverse(function (node) {
    if (node instanceof Mesh && node.geometry.type === "CylinderGeometry") {
      node.material = node.name.split("/")[3] === 'true' ? chipMaterialGray : chipMaterialRed;
    }
  });
}

/**
 * Nettoie la liste des jetons en les supprimant de la scène
 * @param {object} scene - La scène Three.js
 */
function clearChipStackList(scene) {
  for (let chip of currentChipStackList) {
      scene.remove(chip); // Enlever le jeton de la scène
  }
  // Vider le tableau des jetons créés
  currentChipStackList = [];
}

/**
 * Nettoie la liste des jetons en les supprimant de la scène
 * @param {object} scene - La scène Three.js
 */
function clearPictureBets(scene) {
  for (let chip of currentPictureBetsList) {
      scene.remove(chip); // Enlever le jeton de la scène
  }
  // Vider le tableau des jetons créés
  currentPictureBetsList = [];
}

export { createChipStacks, createPictureBets, hideChips, showChips, clearChipStackList, clearPictureBets };
