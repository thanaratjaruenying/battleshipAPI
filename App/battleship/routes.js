import * as utils from '../utils';
import controllers from './controllers';
import db from '../../db';

export function setup(router) {
  router.all('/', (req, res) => {
    controllers.getGameState(req, res);
  });

  // create game
  router.post('/create', (req, res) => {
    controllers.createGame(req, res);
  });

  // reset game to initial state
  router.post('/reset', async (req, res) => {
    controllers.resetGame(req, res);
  });

  // place ship into the ocean
  router.post('/ship', async (req, res) => {
    controllers.placedShip(req, res);
  });

  // attack target on the ocean
  router.post('/attack', async (req, res) => {
    controllers.attackShip(req, res);
  });
}
