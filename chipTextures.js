import { TextureLoader, MeshBasicMaterial, MeshLambertMaterial } from 'three';

const DEFAULT_TEXTURES = {
  redChip: 'redChip.png',
  greenChip: 'greenChip.png'
};

const DEFAULT_COLORS = {
  sideGray: 0xffffff,
  sideRed: 0xff0000
};

const loader = new TextureLoader();

const loadTexture = (path) => loader.load(path);

// Chargement des textures
const redChipTexture = loadTexture(DEFAULT_TEXTURES.redChip);
const greenChipTexture = loadTexture(DEFAULT_TEXTURES.greenChip);

const redChipMaterial = new MeshBasicMaterial({ map: redChipTexture });
const greenChipMaterial = new MeshBasicMaterial({ map: greenChipTexture });

const createChipMaterials = (sideColor, topMaterial) => [
  new MeshLambertMaterial({ color: sideColor }),
  topMaterial,
  new MeshLambertMaterial({ color: Math.random() * 0xffffff })
];

export const createChipMaterialGray = (config = {}) => {
  const { sideColor = DEFAULT_COLORS.sideGray, topMaterial = greenChipMaterial } = config;
  return createChipMaterials(sideColor, topMaterial);
};

export const createChipMaterialRed = (config = {}) => {
  const { sideColor = DEFAULT_COLORS.sideRed, topMaterial = redChipMaterial } = config;
  return createChipMaterials(sideColor, topMaterial);
};

// Utilisation par défaut
const chipMaterialGray = createChipMaterialGray();
const chipMaterialRed = createChipMaterialRed();

export { chipMaterialGray, chipMaterialRed };
