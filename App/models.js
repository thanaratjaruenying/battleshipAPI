import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const CoordinateSchema = new Schema({row: Number, col: Number});
export const ShipSchema = new Schema({
  grids: [CoordinateSchema],
  status: String,
  direction: String,
  size: Number
});
export const GameStateSchema = new Schema({
  gameState: {
    type: String,
    required: 'state status',
    default: 'joining'
  },
  attacker: {
    hitGrids: [CoordinateSchema],
    missGrids: [CoordinateSchema]
  },
  defender: {
    placements: {
      battleships: [ShipSchema],
      cruisers: [ShipSchema],
      destroyers: [ShipSchema],
      submarines: [ShipSchema]
    }
  },
  occupyGrids: [CoordinateSchema],
  adjacentGrids: [CoordinateSchema],
  size: {
    type: String,
    default: '10'
  }
});

export default mongoose.model('GameState', GameStateSchema);
