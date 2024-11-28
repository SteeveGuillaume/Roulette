import { createChip } from './chipCreation.js';

let currentPictureBetsList = [];

/**
 * Vérifie si un jeton existe déjà à une position donnée.
 * @param {number} posX - La position X du jeton.
 * @param {number} posY - La position Y du jeton.
 * @returns {boolean} - Retourne true si un jeton existe déjà à cette position, sinon false.
 */
function chipExistsAtPosition(posX, posZ) {
  return currentPictureBetsList.some(chip => chip.position.x === posX && chip.position.z === posZ);
}

/**
 * Crée un les jetons des figures à une position donnée
 * @param {array} chipList - Liste des jetons
 * @param {number} posX - La position X 
 * @param {number} posY - La position Y 
 * @param {object} scene - La scène Three.js
 */
export function createPictureBets(chipList, posX, posZ, scene) {
  chipList.forEach(chip => {
    const chipPosX = (chip[0] * 9) + posX;
    const chipPosZ = (chip[1] * 9) + posZ;
    if (!chipExistsAtPosition(chipPosX, -chipPosZ)) {
      let chipMesh = createChip(chipPosX, 0, chipPosZ, false, scene);
      currentPictureBetsList.push(chipMesh);
    }
  });
}

/**
 * Crée un les jetons de la figure du zéro
 * @param {object} scene - La scène Three.js
 */
export function createSpecialPictureBets(scene) {
  let chipMesh = createChip(-9, 0, 27, false, scene);
  currentPictureBetsList.push(chipMesh);
  for (let i = 0; i < 6; i++) {
    chipMesh = createChip(0, 0, i * 9, false, scene);
    currentPictureBetsList.push(chipMesh);
  }
}

/**
 * Nettoie la liste des jetons en les supprimant de la scène
 * @param {object} scene - La scène Three.js
 */
export function clearPictureBets(scene) {
  for (let chip of currentPictureBetsList) {
    scene.remove(chip); // Enlever le jeton de la scène
  }
  // Vider le tableau des jetons créés
  currentPictureBetsList = [];
}