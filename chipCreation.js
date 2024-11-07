import { Mesh } from 'three';
import { getChipMaterial } from './chipMaterials.js';
import { createCylinderGeometry } from './chipGeometry.js';

/**
 * Crée un jeton avec des matériaux et une position donnés
 * @param {number} posX - Position X du jeton
 * @param {number} posY - Position Y du jeton
 * @param {number} posZ - Position Z du jeton
 * @param {boolean} isGray - Indicateur de la couleur du jeton
 * @param {object} scene - La scène Three.js
 */
export function createChip(posX, posY, posZ, isGray, scene) {
  const material = getChipMaterial(isGray);
  const chip = new Mesh(new createCylinderGeometry(), material);
  chip.name = `chip-${posZ}/${posX}/${posY}/${isGray}`;
  chip.position.set(posX, posY, -posZ);
  chip.rotation.y = Math.random() * Math.PI * 3;
  scene.add(chip);
  return chip;
}