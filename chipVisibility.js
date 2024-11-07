import { Mesh } from 'three';
import { transparentMaterial, getChipMaterial } from './chipMaterials.js';

/**
 * Cache un jeton en le rendant transparent
 * @param {object} chip - Jeton à cacher
 */
export function hideChips(chip) {
  chip.material = transparentMaterial;
}

/**
 * Affiche les jetons en restaurant leur matériau d'origine
 * @param {object} scene - La scène Three.js
 */
export function showChips(scene) {
  scene.traverse(function (node) {
    if (node instanceof Mesh && node.geometry.type === "CylinderGeometry") {
      const isGray = node.name.split("/")[3] === 'true';
      node.material = getChipMaterial(isGray);
    }
  });
}