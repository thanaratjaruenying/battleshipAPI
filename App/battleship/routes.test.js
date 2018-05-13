import mongoose from 'mongoose';
import httpMocks from 'node-mocks-http';
import GameState from '../models';
import controllers from './controllers';

describe('Test simulate game', async () => {
  beforeAll(() => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/BattleshipTest');
    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
  });

  it('createGame', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/create',
    });
    let response = httpMocks.createResponse();
    await controllers.createGame(request, response);
    done();
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
