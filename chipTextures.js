import { TextureLoader, MeshBasicMaterial, MeshLambertMaterial, CanvasTexture } from 'three';

const DEFAULT_TEXTURES = {
  redChip: 'redChip.png',
  greenChip: 'greenChip.png'
};

const loader = new TextureLoader();

const loadTexture = (path) => loader.load(path);

// Chargement des textures
const redChipTexture = loadTexture(DEFAULT_TEXTURES.redChip);
const greenChipTexture = loadTexture(DEFAULT_TEXTURES.greenChip);

// Fonction pour créer une texture alternée
const createAlternatingTexture = (isGray) => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 10;
  const context = canvas.getContext('2d');

  for (let i = 0; i < 10; i++) {
    context.fillStyle = isGray ? (i % 2 === 0 ? '#808080' : '#FFFFFF') : (i % 2 === 0 ? '#FF0000' : '#FFFFFF');
    context.fillRect(i * 10, 0, 10, 10);
  }

  return new MeshLambertMaterial({ map: new CanvasTexture(canvas) });
};

const createDottedTexture = (isGray) => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 10;
  const context = canvas.getContext('2d');

  // Définir le fond et la couleur des points en fonction de isGray
  const backgroundColor = isGray ? '#FFFFFF' : '#FF0000';
  const dotColor = isGray ? '#808080' : '#FFFFFF';

  // Remplir le fond
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Dessiner les points
  for (let i = 0; i < 10; i++) {
    context.fillStyle = dotColor;
    context.beginPath();
    context.arc(i * 10 + 5, 5, 3, 0, Math.PI * 2, true);
    context.fill();
  }

  return new MeshLambertMaterial({ map: new CanvasTexture(canvas) });
};

// Fonction pour créer les matériaux de puce
const createChipMaterials = (isGray, topTexture) => [
  isGray? createAlternatingTexture(isGray) : createDottedTexture(isGray),
  new MeshBasicMaterial({ map: topTexture }),
  new MeshBasicMaterial({ map: topTexture })
];

// Utilisation par défaut
const chipMaterialGray = createChipMaterials(true, greenChipTexture);
const chipMaterialRed = createChipMaterials(false, redChipTexture);

export { chipMaterialGray, chipMaterialRed };