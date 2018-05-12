import mongoose from 'mongoose';
const GameState = mongoose.model('GameState');

import * as utils from '../utils';
const testId = '5af6e8fd9f6a9525d8695135';

export default {
  getGameState(req, res) {
    const {id} = req.query;
    GameState.findOne({_id: testId}, (err, gm) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(gm);
    });
  },
  createGame(req, res) {
    const newGame = new GameState();
    newGame.set({gameState: utils.gameState.arranging});
    newGame.save((err, gm) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(gm);
    });
  },
  resetGame(req, res) {
    const {id} = req.query;
    GameState.update({ _id: testId }, {
      $set: {
        size: '10',
        defender: {
          battleships: [],
          cruisers: [],
          destroyers: [],
          submarines: []
        },
        occupyGrids: [],
        adjacentGrids: [],
        attacker: {
          hitGrids: [],
          missGrids: []
        }
      }
    }, (err, gm) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).send('Reset successfully');
    });
  },
  async placedShip(req, res) {
    let {id, shipType, coordinates, shipDirection} = req.query;
    const db = await GameState.findOne({_id: testId}, (err, gm) => {
      if (err) {
        return res.status(500).json(err);
      }
    });
    const {occupyGrids, adjacentGrids, gameState, defender} = db;

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

    const newPlacements = [{
      grids: [...coordinates],
      status: utils.shipStatus.float,
      direction: shipDirection,
      size: coordinates.length
    }];
    const closeGrids = utils.getCloseGrids(coordinates, adjacentGrids);

    if (utils.placedShips(defender.placements)) {
      await GameState.update({_id: testId}, {
        $set: {gameState: utils.gameState.inProgress}
      }, (err, gm) => {
        if (err) {
          return res.send(err);
        }
      });
    }
    const keyPlacements = `defender.placements.${shipType}`;
    await GameState.update({
      _id: testId
    },{
      $addToSet: {
        [keyPlacements]: newPlacements,
        occupyGrids: coordinates,
        adjacentGrids: closeGrids
      }
    }, (err, gm) => {
      if (err) {
        return res.send(err);
      }
    });

    res.status(200).send('Placed');
  },
  async attackShip(req, res) {
    let {id, coordinate} = req.query;
    const db = await GameState.findOne({_id: testId}, (err, gm) => {
      if (err) {
        return res.status(500).json(err);
      }
    });
    let {
      occupyGrids, adjacentGrids, gameState, defender: {placements},
      attacker: {hitGrids, missGrids}
    } = db;

    // switch (gameState) {
    //   case utils.gameState.joining: return res.status(400).send('Create game first');
    //   case utils.gameState.arranging: return res.status(400).send('Place all ships before attacking');
    //   case utils.gameState.finished: return res.status(400).send('Game finished');
    // }

    if (!coordinate) {
      return res.status(400).send('Invalid coordinate ' + coordinate);
    }
    coordinate = JSON.parse(coordinate);

    const foundHit = hitGrids.find(hg => hg.row === coordinate.row && hg.col === coordinate.col);
    const foundMiss = hitGrids.find(hg => hg.row === coordinate.row && hg.col === coordinate.col);
    if (foundHit || foundMiss) {
      return res.status(400).send('Attacked ' + JSON.stringify(coordinate));
    }

    const hitGrid = occupyGrids.find(oc => oc.row === coordinate.row && oc.col === coordinate.col);
    if (hitGrid) {
      hitGrids.push(coordinate)
      const {theShip, ship, statusAfterAttack} = utils.findAttackedShip(coordinate, placements);
      console.log(theShip, ship, statusAfterAttack);
      // placements[ship] = [...theShips];

      // const isGameover = utils.isGameover(placements);
      // if (isGameover) {
      //   db[testId].gameState = utils.gameState.finished;
      //   return res.status(200).send([
      //     statusAfterAttack,
      //     `Game over, Missed ${missGrids.length} shot`
      //   ]);
      // }
      res.status(200).send(statusAfterAttack);
    } else {
      missGrids.push(coordinate);
      res.status(200).send('Miss');
    }
  },
}