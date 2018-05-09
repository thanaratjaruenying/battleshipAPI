import * as utils from '../utils';
import db from '../../db';

const testId = 'test';

export function setup(router) {
  router.all('/', (req, res, next) => {
    res.status(200).send(db[testId]);
  });

  // create game
  router.post('/create', (req, res, next) => {
    let currentGame = db[testId];
    if (currentGame.gameState === utils.gameState.joining) {
      currentGame.gameState = utils.gameState.arranging;
      res.status(200).send(currentGame);
    } else {
      res.status(200).send({text: 'Already created', state: currentGame});
    }
  });

  // reset game to initial state
  router.post('/reset', async (req, res, next) => {
    db[testId] = {...utils.initState};
    res.status(200).send('Reset successfully');
  });

  // place ship into the ocean
  router.post('/ship', async (req, res, next) => {
    let {shipType, coordinates, shipDirection} = req.query;
    let {occupyGrids, adjacentGrids, gameState, defender} = db[testId];
    if (!coordinates) {
      return res.status(400).send('Invalid coordinates ' + coordinates);
    }
    coordinates = JSON.parse(coordinates);
    if (!shipType || !shipDirection) {
      return res.status(400).send('Missed some query string');
    }
    const isLimitShip = utils.isLimitShip(shipType, defender.placements[shipType]);
    if (isLimitShip) {
      return res.status(400).send(`All ${shipType} has been deployed`);
    }
    const isValid = utils.isValidCoordinate(coordinates, occupyGrids, adjacentGrids);
    if (isValid === 'Not allow' || isValid === 'Illegal') {
      return res.status(400).send(isValid);
    }
    if (
      shipDirection !== utils.shipDirection.vertical &&
      shipDirection !== utils.shipDirection.horizontal
    ) {
      return res.status(400).send('Invalid direction');
    }
    if (gameState === utils.gameState.joining) {
      return res.status(400).send('Joining');
    }
    if (gameState === utils.gameState.inProgress) {
      return res.status(400).send('Inprogress');
    }
    if (gameState === utils.gameState.finished) {
      return res.status(400).send('Finished');
    }

    defender.placements[shipType].push({
      grids: [...coordinates],
      status: utils.shipStatus.float,
      direction: shipDirection,
      size: coordinates.length
    });
    occupyGrids.push(...coordinates);
    const closeGrids = utils.getCloseGrids(coordinates, adjacentGrids);
    adjacentGrids.push(...closeGrids);

    if (utils.placedShips(defender.placements)) {
      db[testId].gameState = gameState.inProgress;
    }
    res.status(200).send('Placed');
  });

  // attack target on the ocean
  router.post('/attack', async (req, res, next) => {
    let {coordinate} = req.query;
    let {
      occupyGrids, adjacentGrids, gameState, defender: {placements},
      attacker: {hitGrids, missGrids}
    } = db[testId];
    switch (gameState) {
      case utils.gameState.joining: return res.status(400).send('Create game first');
      case utils.gameState.arranging: return res.status(400).send('Place all ships before attacking');
      case utils.gameState.finished: return res.status(400).send('Game finished');
    }

    if (!coordinate) {
      return res.status(400).send('Invalid coordinate ' + coordinate);
    }
    coordinate = JSON.parse(coordinate);

    const foundHit = hitGrids.find(hg => hg.row === coordinate.row && hg.col === coordinate.col);
    const foundMiss = hitGrids.find(hg => hg.row === coordinate.row && hg.col === coordinate.col);
    if (foundHit || foundMiss) {
      return res.status(400).send('Attacked' + JSON.stringify(coordinate));
    }

    const hitGrid = occupyGrids.find(oc => oc.row === coordinate.row && oc.col === coordinate.col);
    if (hitGrid) {
      hitGrids.push(coordinate)
      const {theShips, ship, statusAfterAttack} = utils.findAttackedShip(coordinate, placements);
      placements[ship] = [...theShips];

      const isGameover = utils.isGameover(placements);
      if (isGameover) {
        db[testId].gameState = utils.gameState.finished;
        return res.status(200).send([
          statusAfterAttack,
          `Game over, Missed ${missGrids.length} shot`
        ]);
      }
      res.status(200).send(statusAfterAttack);
    } else {
      missGrids.push(coordinate);
      res.status(200).send('Miss');
    }
  });
}
