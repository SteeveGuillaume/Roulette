// chipCreation.js

import { Mesh, MeshBasicMaterial } from 'three';
import { chipMaterialGray, chipMaterialRed } from './chipTextures.js';
import { createCylinderGeometry, DEFAULT_CHIP_ATTRIBUTE } from './chipGeometry.js';


function createPictureBets(chipList, startX, startY, scene) {
  chipList.forEach(chip => {
      createChip((chip[0] * 9) + startX, 0, (chip[1] * 9) + startY, false, scene);
  });
}

/**
 * Crée un quincunx de jetons
 * @param {number} chips - Nombre de jetons à empiler
 * @param {number} posX - Position X initiale
 * @param {number} posZ - Position Z initiale
 * @param {number} currentHeight - Hauteur actuelle de la pile
 * @param {object} scene - La scène Three.js
 * @returns {number} - Nouvelle hauteur après avoir empilé les jetons
 */
function createQuincunx(chips, posX, posZ, currentHeight, scene) {
  const isGrayChip = currentHeight === 0;
  const nbColumns = Math.floor(chips / 5);
  const totalHeight = chips + currentHeight;
  let step = 3;
  let switchColumn = false;

  for (let i = 0; i < nbColumns * 5; i++) {
    if (i % 5 === 0) switchColumn = !switchColumn;
    createChipAtPosition(switchColumn, posX, posZ, currentHeight, step, isGrayChip, scene);
    currentHeight++;
  }

  while (currentHeight < totalHeight) {
    createChipAtPosition(switchColumn, posX, posZ, currentHeight, step, isGrayChip, scene);
    currentHeight++;
    step += 3;
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
  const adjustedPosX = switchColumn ? (posX + step / 10) : (posX - (step + 6) / 10);
  const adjustedPosZ = isGrayChip ? posZ : (posZ - (step * 2) / 10);
  const posY = (currentHeight * DEFAULT_CHIP_ATTRIBUTE.height) + DEFAULT_CHIP_ATTRIBUTE.height;
  createChip(adjustedPosX, posY, adjustedPosZ, isGrayChip, scene);
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

export { createQuincunx, createPictureBets, hideChips, showChips };
