import { createPictureBets, createSpecialPictureBets, clearPictureBets } from './pictureBetManagement.js';
import {
    POSITION_MAP_FRST,
    POSITION_MAP_SCND,
    POSITION_MAP_THRD,
    PictureBetsConfig,
    MapBoxKeys
} from './pictureBetsConstant.js';

let currentPbPositionList = [];

function populatePictureBetsByGroup(group, scene, positionMap) {
    const boxMap = MapBoxKeys(positionMap);
    if(positionMap === POSITION_MAP_FRST) {
        if(Math.random() < 0.3){
            createSpecialPictureBets(scene);
            currentPbPositionList.box0 = '116';
        }
    }
    if (group === 'oneSide') {
        return populate1SidePictureBets(scene, positionMap, boxMap);
    } else if (group === 'twoSide') {
        return populate2SidePictureBets(scene, positionMap, boxMap);
    } else if (group === 'threeSide') {
        return populate3SidePictureBets(scene, positionMap, boxMap);
    }
}

function populate1SidePictureBets(scene, positionMap, boxMap) {
    const whichCenter = Math.random() < 0.5 ? '103' : '68';
    currentPbPositionList[boxMap.box5] = whichCenter;

    const possibleValues = ['52', '69', '86', '34', '51'];
    shuffleArray(possibleValues);

    createPictureBets(PictureBetsConfig.oneSide.center[whichCenter], positionMap.box5.startX, positionMap.box5.startY, scene);
    createPictureBets(PictureBetsConfig.oneSide.up[possibleValues[0]], positionMap.box4.startX, positionMap.box4.startY, scene);
    createPictureBets(PictureBetsConfig.oneSide.left[possibleValues[1]], positionMap.box8.startX, positionMap.box8.startY, scene);
    createPictureBets(PictureBetsConfig.oneSide.right[possibleValues[2]], positionMap.box2.startX, positionMap.box2.startY, scene);
    createPictureBets(PictureBetsConfig.oneSide.down[possibleValues[3]], positionMap.box6.startX, positionMap.box6.startY, scene);

    currentPbPositionList[boxMap.box4] = possibleValues[0];
    currentPbPositionList[boxMap.box8] = possibleValues[1];
    currentPbPositionList[boxMap.box2] = possibleValues[2];
    currentPbPositionList[boxMap.box6] = possibleValues[3];

    return currentPbPositionList;
}

function populate2SidePictureBets(scene, positionMap, boxMap) {
    let box2 = [];
    let box4 = [];
    let box5 = [];
    let box6 = [];
    let box8 = [];

    const whichSideFor51 = Math.floor(Math.random() * 4);
    const whichCenter = Math.floor(Math.random() * 3);
    const leftOrRight = Math.random() < 0.5;

    handle51Positions(whichSideFor51, whichCenter, box2, box4, box6, box8, boxMap);
    handleCenterPositions(whichCenter, leftOrRight, box2, box5, box6, box8, boxMap);   
    
    createPictureBets(box2, positionMap.box2.startX, positionMap.box2.startY, scene);
    createPictureBets(box4, positionMap.box4.startX, positionMap.box4.startY, scene);
    createPictureBets(box5, positionMap.box5.startX, positionMap.box5.startY, scene);
    createPictureBets(box6, positionMap.box6.startX, positionMap.box6.startY, scene);
    createPictureBets(box8, positionMap.box8.startX, positionMap.box8.startY, scene);

    return currentPbPositionList;
}

function handle51Positions(whichSideFor51, whichCenter, box2, box5, box6, box8, boxMap) {
    const side51List = ["up", "down", "left", "right"];
    if (whichSideFor51 === 0) {
        box5.push(...PictureBetsConfig.twoSide["51"].up);
        currentPbPositionList[boxMap.box4] = "51";
    } else if (whichSideFor51 === 1 && whichCenter !== 0) {
        box8.push(...PictureBetsConfig.twoSide["51"].left);
        currentPbPositionList[boxMap.box8] = "51";
    } else if (whichSideFor51 === 2) {
        box2.push(...PictureBetsConfig.twoSide["51"].right);
        currentPbPositionList[boxMap.box2] = "51";
    } else if (whichSideFor51 === 3 && whichCenter !== 0) {
        box6.push(...PictureBetsConfig.twoSide["51"].down);
        currentPbPositionList[boxMap.box6] = "51";
    }
}

function handleCenterPositions(whichCenter, leftOrRight, box2, box5, box6, box8, boxMap) {
    const centerList = ["59", "32", "67"];
    const side59List = ["43", "25"];
    const center = centerList[whichCenter];
    currentPbPositionList[boxMap.box5] = center;
    if (whichCenter === 0) {
        box5.push(...PictureBetsConfig.twoSide.center[center]);
        if (box2.length === 0) {
            const whichRight = Math.random() < 0.5;
            box2.push(...PictureBetsConfig.twoSide.center[whichRight ? "32" : "67"]);
            currentPbPositionList[boxMap.box2] = whichRight ? "32" : "67";
        }
        const whichLeft = Math.random() < 0.5;
        box6.push(...PictureBetsConfig.twoSide.down[whichLeft ? side59List[0] : side59List[1]]);
        currentPbPositionList[boxMap.box6] = whichLeft ? side59List[0] : side59List[1];
        box8.push(...PictureBetsConfig.twoSide.left[whichLeft ? side59List[1] : side59List[0]]);
        currentPbPositionList[boxMap.box8] = whichLeft ? side59List[1] : side59List[0];
    } else {
        box5.push(...PictureBetsConfig.twoSide.center[center]);
        if (box2.length === 0) {
            box2.push(...PictureBetsConfig.twoSide.center[leftOrRight ? "59Rt" : (whichCenter === 1 ? "67" : "32")]);
            currentPbPositionList[boxMap.box2] = leftOrRight ? "59" : (whichCenter === 1 ? "67" : "32");
        }
        if (box8.length === 0) {
            box8.push(...PictureBetsConfig.twoSide.center[leftOrRight ? (whichCenter === 1 ? "67" : "32") : "59"]);
            currentPbPositionList[boxMap.box8] = leftOrRight ? (whichCenter === 1 ? "67" : "32") : "59";
        }
    }
}

function populate3SidePictureBets(scene, positionMap, boxMap) {
    const whichCenter = Math.random() < 0.5;
    const leftOrRight = Math.random() < 0.5;
    const upOrDown = Math.random() < 0.5;

    if(Math.random() < 0.3){
        currentPbPositionList[boxMap.box2] = "156";
        const possibleValues = ['33', '100', '66', '102'];
        shuffleArray(possibleValues);
        createPictureBets(PictureBetsConfig.threeSide["135"], positionMap.box2.startX, positionMap.box2.startY, scene);
        createPictureBets(PictureBetsConfig.threeSide["156"], positionMap.box2.startX, 0, scene);
        createPictureBets(PictureBetsConfig.threeSide[possibleValues[0]], positionMap.box8.startX, positionMap.box8.startY, scene);
        currentPbPositionList[boxMap.box4] = "156";
        currentPbPositionList[boxMap.box8] = possibleValues[0];
    } else {
        const center = whichCenter ? "135" : "100";
        const left = leftOrRight ? "100" : "66";
        const right = leftOrRight ? "66" : "100";
        const up = upOrDown ? "102Down" : "33";
        const down = upOrDown ? "33" : "102";

        currentPbPositionList[boxMap.box2] = left;
        currentPbPositionList[boxMap.box5] = center;
        currentPbPositionList[boxMap.box8] = right;
        currentPbPositionList[boxMap.box4] = up;
        currentPbPositionList[boxMap.box6] = down;

        createPictureBets(PictureBetsConfig.threeSide[center], positionMap.box5.startX, positionMap.box5.startY, scene);
        createPictureBets(PictureBetsConfig.threeSide[left], positionMap.box2.startX, positionMap.box2.startY, scene);
        createPictureBets(PictureBetsConfig.threeSide[right], positionMap.box8.startX, positionMap.box8.startY, scene);
        createPictureBets(PictureBetsConfig.threeSide[upOrDown ? up : down], positionMap[upOrDown ? 'box4' : 'box6'].startX, positionMap[upOrDown ? 'box4' : 'box6'].startY, scene);
    }

    return currentPbPositionList;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function populatePictureBets(scene) {
    clearPictureBets(scene);
    clearCurrentPBList();
    const group = Math.random() < 0.33 ? 'oneSide' : (Math.random() < 0.5 ? 'twoSide' : 'threeSide');
    return populatePictureBetsByGroup(group, scene, POSITION_MAP_SCND);
}

function clearCurrentPBList() {
    Object.keys(currentPbPositionList).forEach(key => {
        currentPbPositionList[key] = 0;
    });
}