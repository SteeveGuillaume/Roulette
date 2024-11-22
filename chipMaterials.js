import { MeshBasicMaterial } from 'three';
import { chipMaterialGray, chipMaterialRed } from './chipTextures.js';

export function getChipMaterial(isGray) {
  return isGray ? chipMaterialRed : chipMaterialGray;
}

export const transparentMaterial = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });