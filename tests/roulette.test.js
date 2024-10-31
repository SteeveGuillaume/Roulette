import * as THREE from 'three';
import { createQuincunx, createChip, populatePB } from '../path/to/your/module';

describe('Roulette Table Functions', () => {
  let scene;

  beforeEach(() => {
    scene = new THREE.Scene();
  });

  test('createChip creates a chip at specified position with correct color', () => {
    const posX = 10, posY = 5, posZ = -10, color = true;
    createChip(posX, posY, posZ, color);

    const chip = scene.getObjectByName(`chip-${posZ}/${posX}/${posY}/${color}`);
    expect(chip).toBeDefined();
    expect(chip.position).toEqual(new THREE.Vector3(posX, posY, -posZ));
  });

  test('createQuincunx creates the correct number of chips in the correct positions', () => {
    const chips = 10, posX = 10, posZ = -10, currentHeight = 0;
    const finalHeight = createQuincunx(chips, posX, posZ, currentHeight);

    expect(finalHeight).toBe(chips + currentHeight);
  });

  test('populatePB creates picture bets in correct positions', () => {
    const zone = 0;
    populatePB(zone);

    // Check if picture bets are created. For simplicity, we only check the existence of some of them.
    const pb20 = scene.getObjectByName('pb20');
    expect(pb20).toBeDefined();
  });
});
