export default {
  test: {
    'gameState': 'joining',
    'attacker': {
      'hitGrids': [],
      'missGrids': []
    },
    'defender': {
      'placements': {
        battleships: [],
        cruisers: [],
        destroyers: [],
        submarines: [],
      //   battleship: [{
      //     grids: [
      //       {row: 1, col: 1},
      //       {row: 1, col: 2},
      //       {row: 1, col: 3},
      //       {row: 1, col: 4},
      //     ],
      //     status: 'float/sunk',
      //     direction: 'horizontal',
      //     size: 4
      //   }],
      },
      'ships': {
        'battleship': {
          'amount': 1,
          'size': 4
        },
        'cruiser': {
          'amount': 2,
          'size': 3
        },
        'destroyer': {
          'amount': 3,
          'size': 2
        },
        'submarine': {
          'amount': 3,
          'size': 1
        }
      }
    },
    // ครอบครองกิต
    'occupyGrids': [],
    // กิตที่อยู่ติดกัน
    'adjacentGrids': [],
    'size': 10
  }
}