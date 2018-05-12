import mongoose from 'mongoose';
const GameState = mongoose.model('GameState');

import * as utils from '../utils';
const testId = '5af6e8fd9f6a9525d8695135';

export default {
  getGameState(req, res) {
    const {id} = req.query;
    GameState.find({_id: testId}, (err, gm) => {
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
    const db = await GameState.find({_id: testId}, (err, gm) => {
      if (err) {
        return res.status(500).json(err);
      }
    });
    const {occupyGrids, adjacentGrids, gameState, defender} = db[0];

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

    // defender.placements[shipType].push({
    //   grids: [...coordinates],
    //   status: utils.shipStatus.float,
    //   direction: shipDirection,
    //   size: coordinates.length
    // });
    const newPlacements = [{
      grids: [...coordinates],
      status: utils.shipStatus.float,
      direction: shipDirection,
      size: coordinates.length
    }];

    // occupyGrids.push(...coordinates);
    const closeGrids = utils.getCloseGrids(coordinates, adjacentGrids);
    // adjacentGrids.push(...closeGrids);

    if (utils.placedShips(defender.placements)) {
      // gameState = utils.gameState.inProgress;
      await GameState.update({_id: testId}, {
        $set: {gameState: utils.gameState.inProgress}
      }, (err, gm) => {
        if (err) {
          return res.send(err);
        }
      });
    }

    await GameState.update({
      _id: testId
    },{
      $set: {
        'defender.placements': {
          [shipType]: {
            status: utils.shipStatus.float,
            direction: shipDirection,
            size: coordinates.length,
            $addToSet: {
              grids: coordinates
            }
          }
        }
      },
      $addToSet: {
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
}