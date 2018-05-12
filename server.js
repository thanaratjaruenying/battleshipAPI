import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import GameState from './App/models';

export default class Server {
  setup() {
    const app = express();
    const PORT = process.env.PORT || 3001;
  
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/Battleship'); 
    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
  
    this._setupRoutes(app);

    app.listen(PORT, () => console.log(`Start on http://localhost:${PORT}`));
  }

  _setupRoutes(app) {
    const APP_DIR = `${__dirname}/App`;
    const features = fs.readdirSync(APP_DIR).filter(
      file => fs.statSync(`${APP_DIR}/${file}`).isDirectory()
    );
  
    features.forEach(feature => {
      const router = express.Router();
      const routes = require(`${APP_DIR}/${feature}/routes.js`);
  
      routes.setup(router);
      app.use(`/${feature}`, router);
    });
  }
}
