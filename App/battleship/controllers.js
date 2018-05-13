import mongoose from 'mongoose';
import Promise from 'bluebird';
Promise.promisifyAll(require('mongoose'));

const GameState = mongoose.model('GameState');
import * as utils from '../utils';

export default {
  async getGameState(req, res) {
    const {id} = req.query;
    try {
      const result = await GameState.findOne({_id: id});
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createGame(req, res) {
    try {
      const newGame = new GameState();
      newGame.set({gameState: utils.gameState.arranging});
      const result = await newGame.save();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async resetGame(req, res) {
    const {id} = req.query;
    try {
      const result = await GameState.update({ _id: id}, {
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
      });
      res.status(200).send('Reset successfully');
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async placedShip(req, res) {
    let {id, shipType, coordinates, shipDirection} = req.query;
    let db;

    try {
      db = await GameState.findOne({_id: id});
    } catch (err) {
      return res.status(500).json(err);
    }
    if (!db) {
      return res.status(404);
    }
    const {occupyGrids, adjacentGrids, gameState, defender} = db;

    if (!coordinates) {
      return res.status(400).send('Invalid coordinates ' + coordinates);
    }
    if (typeof coordinates === 'string') {
      coordinates = JSON.parse(coordinates);
    }

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

    const keyPlacements = `defender.placements.${shipType}`;
    try {
      await GameState.update({
        _id: id
      },{
        $addToSet: {
          [keyPlacements]: newPlacements,
          occupyGrids: coordinates,
          adjacentGrids: closeGrids
        }
      });
    } catch (err) {
      return res.status(500).send(err);
    }
    if (utils.placedShips(defender.placements)) {
      try {
        await GameState.update({_id: id}, {
          $set: {gameState: utils.gameState.inProgress}
        }); 
      } catch (err) {
        return res.status(500).send(err);
      }
    }
    res.status(200).send('Placed');
  },
  async attackShip(req, res) {
    let {id, coordinate} = req.query;
    let db;
    try {
      db = await GameState.findOne({_id: id});
    } catch (err) {
      return res.status(500).json(err);
    }
    if (!db) {
      return res.status(404);
    }
    let {
      occupyGrids, adjacentGrids, gameState, defender: {placements},
      attacker: {hitGrids, missGrids}
    } = db;

    switch (gameState) {
      case utils.gameState.joining: return res.status(400).send('Create game first');
      case utils.gameState.arranging: return res.status(400).send('Place all ships before attacking');
      case utils.gameState.finished: return res.status(400).send('Game finished');
    }
    
    if (!coordinate) {
      return res.status(400).send('Invalid coordinate ' + coordinate);
    }
    if (typeof coordinate === 'string') {
      coordinate = JSON.parse(coordinate);      
    }
    const foundHit = hitGrids.find(hg => hg.row === coordinate.row && hg.col === coordinate.col);
    const foundMiss = hitGrids.find(hg => hg.row === coordinate.row && hg.col === coordinate.col);
    if (foundHit || foundMiss) {
      return res.status(400).send('Attacked ' + JSON.stringify(coordinate));
    }

    const hitGrid = occupyGrids.find(oc => oc.row === coordinate.row && oc.col === coordinate.col);
    if (hitGrid) {
      const {theShip, ship, statusAfterAttack} = utils.findAttackedShip(coordinate, placements);
      const keyPlacements = `defender.placements.${ship}`;
      try {
        await GameState.findOneAndUpdate({
          _id: id,
        }, {
          $addToSet: {
            'attacker.hitGrids': coordinate
          },
          $set: {
            [keyPlacements + '.$[grid]']: {
              grids: theShip.grids,
              size: theShip.size,
              status: theShip.status,
            }
          }
        }, {
          arrayFilters: [{'grid._id': mongoose.Types.ObjectId(theShip._id)}]
        });
      } catch (err) {
        return res.send(500).send(error);
      }
      
      const isGameover = utils.isGameover(placements);
      if (isGameover) {
        try {
          await GameState.findOneAndUpdate({_id: id,},
            {$set: {gameState: utils.gameState.finished}}
          );
          return res.status(200).send([
            statusAfterAttack,
            `Game over, Missed ${missGrids.length} shot`
          ]);
        } catch (err) {
          return res.send(500).send(error);
        }
      }

      res.status(200).send(statusAfterAttack);
    } else {
      try {
        await GameState.findOneAndUpdate({_id: id,},
          {$addToSet: {'attacker.missGrids': coordinate}}
        );
      } catch (err) {
        return res.status(500).send(err);
      }
      
      res.status(200).send('Miss');
    }
  },
}
