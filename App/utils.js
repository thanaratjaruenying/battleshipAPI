import _ from 'lodash';

export const gameState = {
  joining: 'joining',
  arranging: 'arranging',
  inProgress: 'inProgress',
  finished: 'finished'
};

export const initState = {
  gameState: gameState.joining,
  attacker: {
    hitGrids: [],
    missGrids: []
  },
  defender: {
    placements: {
      battleship: [],
      cruisers: [],
      destroyers: [],
      submarines: [],
    }
  },
  occupyGrids: [],
  adjacentGrids: [],
  size: 10
};

export const shipStatus = {
  sunk: 'sunk',
  float: 'float',
};

export const shipDirection = {
  vertical: 'vertical',
  horizontal: 'horizontal'
};

export const ships = {
  battleships: {amount: 1, size: 4},
  cruisers: {amount: 2, size: 3},
  destroyers: {amount: 3, size: 2},
  submarines: {amount: 3, size: 1}
};

export function isValidCoordinate(coordinates = [], occupyGrids = [], adjacentGrids = []) {
  for (const e of coordinates) {
    const foundOcc = occupyGrids.find(occ => occ.row === e.row && occ.col === e.col);
    if (foundOcc) {
      return 'Not allow';
    }
    
    const foundAdj = adjacentGrids.find(occ => occ.row === e.row && occ.col === e.col);
    if (foundAdj) {
      return 'Illegal';
    }
    return true;
  }
}

export function isLimitShip(shipType, existShip = []) {
  const maximumShip = ships[shipType].amount;
  return existShip.length >= maximumShip ? true : false;
}

export function getCloseGrids(coordinates = [], adjacentGrids = []) {
  const closeGrid = [];
  for (const coor of coordinates) {
    const {row, col} = coor;
    const top = {row: row - 1, col: col};
    const bottom = {row: row + 1, col: col};
    const right = {row: row, col: col + 1};
    const left = {row: row , col: col -1};
    const topRight = {row: top.row, col: top.col + 1};
    const topLeft = {row: top.row, col: col - 1};
    const bottomRight = {row: bottom.row, col: bottom.col + 1};
    const bottomLeft = {row: bottom.row, col: bottom.col -1};
    const temp = [top, bottom, right, left, topRight, topLeft, bottomRight, bottomLeft];
    closeGrid.push(...temp.filter((e) => (e.row >= 1 && e.row <= 10) && (e.col >= 1 && e.col <= 10)));
  }
  const uniqGrids = _.unionWith(closeGrid, _.isEqual);
  const diffGrids = _.differenceWith(uniqGrids, coordinates, _.isEqual);
  return _.differenceWith(diffGrids, adjacentGrids, (a, b) => a.row === b.row && a.col === b.col);
}

export function placedShips(placements) {
  for (const shipType in ships) {
    const shipLength = placements[shipType].length;
    const maximumShip = ships[shipType].amount;
    if (shipLength !== maximumShip) {
      return false
    }
  }
  return true;
}

export function findAttackedShip(coordinate = {}, placements = {}) {
  const newPlacements = {...placements};
  let statusAfterAttack = '';
  for (const ship in newPlacements) {
    if (ships.hasOwnProperty(ship)) {
      const theShips = newPlacements[ship];
      for (const e in theShips) {
        if (parseInt(e) >= 0) {
          const theShip = theShips[e];
          const foundPoint = theShip.grids.find(e => e.row === coordinate.row && e.col === coordinate.col);
          if (foundPoint) {
            theShip.size -= 1;
            statusAfterAttack = 'Hit';
            if (theShip.size <= 0) {
              theShip.status = shipStatus.sunk;
              statusAfterAttack = `You just sunk the ${ship}`;
            }
            return {theShip, ship, statusAfterAttack};
          }
        }
      }
    }
  }
  return null;
}

export function isGameover(placements) {
  for (const ship in placements) {
    if (placements.hasOwnProperty(ship )) {
      const theShips = placements[ship];
      for (const e in theShips) {
        const theShip = theShips[e];
        if (theShip.status === shipStatus.float) {
          return false;
        }
      }
    }
  }
  return true;
}
