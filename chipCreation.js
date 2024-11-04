// chipCreation.js

import { Mesh, MeshBasicMaterial } from 'three';
import { chipMaterialGray, chipMaterialRed } from './chipTextures.js';
import { createCylinderGeometry, DEFAULT_CHIP_ATTRIBUTE } from './chipGeometry.js';

let currentChipStackList = [];
let currentPictureBetsList = [];

function createPictureBets(chipList, startX, startY, scene) {
  chipList.forEach(chip => {
    let pictureBet = createChip((chip[0] * 9) + startX, 0, (chip[1] * 9) + startY, false, scene);
    currentPictureBetsList.push(pictureBet);
  });
}

/**
 * Crée un quincunx de jetons
 * @param {array} chipStackList - Liste des piles de jetons
 * @param {number} currentHeight - Hauteur actuelle de la pile
 * @param {object} scene - La scène Three.js
 */
function createQuincunx(chipStackList, initialHeight, scene) {
  chipStackList.forEach(chipStack => {
    const { posX, posZ, number } = chipStack;
    let currentHeight = initialHeight;
    const isGrayChip = currentHeight === 0;
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
  });

  return initialHeight;
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
  const baseStep = step / 10;
  const adjustedPosX = parseFloat((posX + (switchColumn ? baseStep : -baseStep - 0.6)).toFixed(1));
  const adjustedPosZ = parseFloat((posZ - (isGrayChip ? 0 : baseStep * 2)).toFixed(1));
  const posY = parseFloat(((currentHeight + 1) * DEFAULT_CHIP_ATTRIBUTE.height).toFixed(1));
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

export { createQuincunx, createPictureBets, hideChips, showChips, clearChipStackList, clearPictureBets };
