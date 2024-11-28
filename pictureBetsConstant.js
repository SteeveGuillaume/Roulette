const BOX_SECTION = 18;
const POSITION_COLUMNS = {
    FIRST: 2,
    SECOND: 6,
    THIRD: 10
};

const generatePositionMap = (column) => ({
    box2: { startX: BOX_SECTION * (column - 1), startY: BOX_SECTION },
    box4: { startX: BOX_SECTION * column, startY: 0 },
    box5: { startX: BOX_SECTION * column, startY: BOX_SECTION },
    box6: { startX: BOX_SECTION * column, startY: BOX_SECTION * 2 },
    box8: { startX: BOX_SECTION * (column + 1), startY: BOX_SECTION },
});

export const POSITION_MAP_FRST = generatePositionMap(POSITION_COLUMNS.FIRST);
export const POSITION_MAP_SCND = generatePositionMap(POSITION_COLUMNS.SECOND);
export const POSITION_MAP_THRD = generatePositionMap(POSITION_COLUMNS.THIRD);

export function MapBoxKeys(positionMap) {
    const map = {};
    if (positionMap === POSITION_MAP_FRST) {
        map.box2 = 'box2';
        map.box4 = 'box4';
        map.box5 = 'box5';
        map.box6 = 'box6';
        map.box8 = 'box8';
    } else if (positionMap === POSITION_MAP_SCND) {
        map.box2 = 'box17';
        map.box4 = 'box19';
        map.box5 = 'box20';
        map.box6 = 'box21';
        map.box8 = 'box23';
    } else if (positionMap === POSITION_MAP_THRD) {
        map.box2 = 'box29';
        map.box4 = 'box31';
        map.box5 = 'box32';
        map.box6 = 'box33';
        map.box8 = 'box35';
    }
    return map;
}

// Configuration for different groups
export const PictureBetsConfig = {
    oneSide: {
        center: {
            "68": [[1, 0], [0, 1], [2, 1], [1, 2]],
            "103": [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]
        },
        down: {
            "52": [[1, 0], [1, 1]],
            "69": [[1, 0], [1, 1], [2, 1]],
            "86": [[1, 0], [0, 1], [1, 1], [2, 1]],
            "34": [[1, 0], [0, 1]],
            "51": [[1, 0], [0, 1], [2, 1]]
        },
        up: {
            "52": [[1, 2], [1, 1]],
            "69": [[1, 2], [1, 1], [2, 1]],
            "86": [[1, 2], [0, 1], [1, 1], [2, 1]],
            "34": [[1, 2], [0, 1]],
            "51": [[1, 2], [0, 1], [2, 1]]
        },
        left: {
            "52": [[0, 1], [1, 1]],
            "69": [[1, 0], [1, 1], [0, 1]],
            "86": [[1, 0], [0, 1], [1, 1], [2, 1]],
            "34": [[1, 0], [0, 1]],
            "51": [[1, 0], [0, 1], [2, 1]]
        },
        right: {
            "52": [[2, 1], [1, 1]],
            "69": [[1, 0], [1, 1], [2, 1]],
            "86": [[1, 0], [0, 1], [1, 1], [2, 1]],
            "34": [[1, 0], [2, 1]],
            "51": [[1, 0], [0, 1], [2, 1]]
        }
    },
    twoSide: {
        center: {
            "32": [[0, 0], [2, 0], [0, 2], [2, 2]],
            "67": [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
            "59": [[0, 0], [2, 0], [1, 1], [0, 2]],
            "59Rt": [[0, 0], [2, 0], [1, 1], [2, 2]]
        },
        down: {
            "43": [[0, 0], [1, 1]],
            "25": [[0, 0], [0, 1]]
        },
        left: {
            "43": [[0, 0], [1, 1]],
            "25": [[0, 0], [1, 0]]
        },
        "51": {
            down: [[0, 0], [2, 0], [1, 1]],
            up: [[0, 2], [2, 2], [1, 1]],
            left: [[0, 0], [0, 2], [1, 1]],
            right: [[2, 0], [2, 2], [1, 1]]
        }
    },
    threeSide: {
        "33": [[0, 0], [1, 0], [2, 0]],
        "102": [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]],
        "102Down": [[0, 2], [1, 2], [2, 2], [0, 1], [1, 1], [2, 1]],
        "66": [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]],
        "100": [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
        "135": [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
        "156": [[0, 0], [1, 0], [2, 0]]
    }
};