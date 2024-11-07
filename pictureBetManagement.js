import { createChip } from './chipCreation.js';

let currentPictureBetsList = [];

/**
 * Crée un quincunx de jetons pour les paris en image
 * @param {array} chipList - Liste des jetons
 * @param {number} posX - La position X 
 * @param {number} posY - La position Y 
 * @param {object} scene - La scène Three.js
 */
export function createPictureBets(chipList, posX, posY, scene) {
  chipList.forEach(chip => {
    let chipMesh = createChip((chip[0] * 9) + posX, 0, (chip[1] * 9) + posY, false, scene);
    currentPictureBetsList.push(chipMesh);
  });
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