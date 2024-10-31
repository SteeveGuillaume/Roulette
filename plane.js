import { PlaneGeometry, Mesh, MeshBasicMaterial, TextureLoader } from 'three';

const DEFAULT_CONFIG = {
  mainPlane: {
    texture: '/paris-roulette.jpeg',
    width: 700 / 2.55,
    height: 314 / 3.4,
    position: { x: 106, z: -13 }
  }
};

export function initializeMainPlane(scene, config = {}) {
  const { mainPlane } = { ...DEFAULT_CONFIG, ...config };

  // Create the main plane with texture
  const tableTexture = new TextureLoader().load(mainPlane.texture);
  const tableMaterial = new MeshBasicMaterial({ map: tableTexture });
  const mainPlaneGeometry = new PlaneGeometry(mainPlane.width, mainPlane.height);
  const mainTable = new Mesh(mainPlaneGeometry, tableMaterial);
  mainTable.position.set(mainPlane.position.x, 0, mainPlane.position.z);
  mainTable.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(mainTable);
}
