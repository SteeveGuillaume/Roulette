import { CylinderGeometry } from 'three';

const DEFAULT_CHIP_ATTRIBUTE = {
  radiusTop: 3.5,
  radiusBottom: 3.5,
  height: 0.5,
  radialSegments: 35,
  heightSegments: 1,
  openEnded: false,
  thetaStart: 0,
  thetaLength: 2 * Math.PI
};

export function createCylinderGeometry(config = {}) {
  const {
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength
  } = { ...DEFAULT_CHIP_ATTRIBUTE, ...config };

  return new CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength
  );
}

export { DEFAULT_CHIP_ATTRIBUTE };
