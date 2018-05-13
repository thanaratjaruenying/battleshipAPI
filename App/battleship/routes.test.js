import mongoose from 'mongoose';
import httpMocks from 'node-mocks-http';
import GameState from '../models';
import controllers from './controllers';

describe('Test simulate game', async () => {
  let testId;

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
    const data = JSON.parse(response._getData());
    testId = data._id;
    expect(response._getStatusCode()).toBe(200);
    expect(testId).not.toBeNull();
    done();
  });

  it('place battleships', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'battleships',
        coordinates: [{row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, {row: 1, col: 4}],
        shipDirection: 'horizontal'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('place cruisers 1', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'cruisers',
        coordinates: [{row: 1, col: 6}, {row: 2, col: 6}, {row: 3, col: 6}],
        shipDirection: 'vertical'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('place cruisers 2', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'cruisers',
        coordinates: [{row: 3, col: 1}, {row: 3, col: 2}, {row: 3, col: 3}],
        shipDirection: 'horizontal'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('place destroyers 1', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'destroyers',
        coordinates: [{row: 5, col: 1}, {row: 6, col: 1}],
        shipDirection: 'vertical'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('place destroyers 2', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'destroyers',
        coordinates: [{row: 5, col: 3}, {row: 6, col: 3}],
        shipDirection: 'vertical'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('place destroyers 3', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'destroyers',
        coordinates: [{row: 5, col: 5}, {row: 6, col: 5}],
        shipDirection: 'vertical'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('place submarines 1', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'submarines',
        coordinates: [{row: 8, col: 1}],
        shipDirection: 'horizontal'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('place submarines 2', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'submarines',
        coordinates: [{row: 8, col: 3}],
        shipDirection: 'horizontal'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('place submarines 3', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'submarines',
        coordinates: [{row: 8, col: 5}],
        shipDirection: 'horizontal'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('place not allow', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'submarines',
        coordinates: [{row: 8, col: 5}],
        shipDirection: 'horizontal'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(400);
    expect(data).toBe('Not allow');
    done();
  });
  
  it('place submarines 4', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'submarines',
        coordinates: [{row: 8, col: 7}],
        shipDirection: 'horizontal'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Placed');
    done();
  });

  it('All submarines has been deployed', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        shipType: 'submarines',
        coordinates: [{row: 8, col: 1}],
        shipDirection: 'horizontal'
      }
    });
    let response = httpMocks.createResponse();
    await controllers.placedShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(400);
    expect(data).toBe('All submarines has been deployed');
    done();
  });

  it('find game', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      query: {id: testId}
    });
    let response = httpMocks.createResponse();
    await controllers.getGameState(request, response);
    const data = JSON.parse(response._getData());
    expect(response._getStatusCode()).toBe(200);
    expect(data).not.toBeNull();
    done();
  });

  it('attack to sank battleship 1,1', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 1, col: 1},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });

  it('attack to sank battleship 1,2', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 1, col: 2},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });

  it('attack to sank battleship 1,3', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 1, col: 3},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });

  it('attack to sank battleship 1,4', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 1, col: 4},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('You just sunk the battleships');
    done();
  });

  it('attack to sank cruiser 1,6', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 1, col: 6},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });

  it('attack to sank cruiser 2,6', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 2, col: 6},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });

  it('attack to sank cruiser 3,6', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 3, col: 6},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('You just sunk the cruisers');
    done();
  });

  it('attack to sank cruiser 3,1', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 3, col: 1},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });

  it('attack to sank cruiser 3,2', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 3, col: 2},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });
  
  it('attack to sank cruiser 3,3', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 3, col: 3},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('You just sunk the cruisers');
    done();
  });

  it('attack miss 3,5', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 3, col: 5},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Miss');
    done();
  });

  it('attack to sank destroyers 5,1', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 5, col: 1},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });

  it('attack to sank destroyers 6,1', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 6, col: 1},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('You just sunk the destroyers');
    done();
  });

  it('attack to sank destroyers 5,3', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 5, col: 3},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });

  it('attack to sank destroyers 6,3', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 6, col: 3},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('You just sunk the destroyers');
    done();
  });

  it('attack to sank destroyers 5,5', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 5, col: 5},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('Hit');
    done();
  });

  it('attack to sank destroyers 6,5', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 6, col: 5},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('You just sunk the destroyers');
    done();
  });

  it('attack to sank submarines 8,1', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 8, col: 1},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('You just sunk the submarines');
    done();
  });

  it('attack to sank submarines 8,3', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 8, col: 3},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('You just sunk the submarines');
    done();
  });

  it('attack to sank submarines 8,5', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 8, col: 5},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toBe('You just sunk the submarines');
    done();
  });

  it('attack to sank submarines 8,7', async (done) => {
    let request  = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      query: {
        id: testId,
        coordinate: {row: 8, col: 7},
      }
    });
    let response = httpMocks.createResponse();
    await controllers.attackShip(request, response);
    const data = response._getData();
    expect(response._getStatusCode()).toBe(200);
    expect(data).toEqual(['You just sunk the submarines', 'Game over, Missed 1 shot']);
    done();
  });

  afterAll((done) => {
    mongoose.disconnect();
  });
});
