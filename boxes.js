import { PlaneGeometry, Mesh, MeshLambertMaterial } from 'three';

const DEFAULT_CONFIG = {
  plane: {
    width: 18,
    height: 18,
    initialPosition: { x: -9, z: -27 }
  },
  grid: {
    rows: 12,
    columns: 3,
    spacing: 18
  },
  materialNumber: {
    color: 0xffffff,
    transparent: true,
    opacity: 0
  }
};

export function initializeBoxes(scene, config = {}) {
  const { plane, grid, materialNumber } = { ...DEFAULT_CONFIG, ...config };

  // Create a material for the numbers
  const numberMaterial = new MeshLambertMaterial(materialNumber);

  // Function to create a plane
  function createPlane(width, height, positionX, positionZ, name) {
    const geometry = new PlaneGeometry(width, height);
    const plane = new Mesh(geometry, numberMaterial);
    plane.position.set(positionX, 0, positionZ);
    plane.rotation.set(-Math.PI / 2, 0, 0);
    plane.name = name;
    scene.add(plane);
  }

  // Initialize the first box to number 0
  createPlane(plane.width, plane.height * 3, plane.initialPosition.x, plane.initialPosition.z, "number0");

  // Create boxes 1 to 36 by lines
  let currentNumber = 1;
  for (let row = 0; row < grid.rows; row++) {
    for (let column = 0; column < grid.columns; column++) {
      createPlane(
        plane.width,
        plane.height,
        (row * grid.spacing) + plane.width / 2,
        -(column * grid.spacing) - plane.height / 2,
        `number${currentNumber}`
      );
      currentNumber++;
    }
  }
}