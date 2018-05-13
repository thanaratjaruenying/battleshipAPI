# battleshipAPI

### Installation guide

1. clone this to your local machines
2. Install [MongoDB](https://www.mongodb.com/)
3. run command `yarn` in the repository
4. run `mongod` to start mongodb server
5. On your browser `http://localhost:3001`

### Test or Simulate

In the repository run `yarn run test`

### API Guide
> **`GET  /battleship?id=""`** return current game state

Key | Value
------------ | -------------
id | ObjectId(required)
```javascript
{
    "attacker": {
        "hitGrids": [],
        "missGrids": []
    },
    "defender": {
        "placements": {
            "battleships": [],
            "cruisers": [],
            "destroyers": [],
            "submarines": []
        }
    },
    "gameState": "arranging",
    "size": "10",
    "_id": TypeObjectID,
    "occupyGrids": [],
    "adjacentGrids": [],
}
```


> **`POST  /battleship/reset?id=""`** reset game to initial state

Key | Value
------------ | -------------
id | ObjectId(required)
```javascript
{
  status: 200
  Reset successfully
}
```


> **`POST  /battleship/create`** return game state

```javascript
{
    "attacker": {
        "hitGrids": [],
        "missGrids": []
    },
    "defender": {
        "placements": {
            "battleships": [],
            "cruisers": [],
            "destroyers": [],
            "submarines": []
        }
    },
    "gameState": "arranging",
    "size": "10",
    "_id": TypeObjectID,
    "occupyGrids": [],
    "adjacentGrids": [],
}
```


> **`POST  /battleship/ship?id=""&shipType=""&coordinates=""&shipDirection=""`** 

place ship to specified grids

Key | Value | Example
------------ | ------------- | -------------
id | ObjectId(required) | 
shipType | String(required) | battleships, cruisers, destroyers, submarines
shipDirection | String(required) | vertical, horizontal
coordinates | Array(required) | [{row: 1, col: 2}, {}, ...]
```javascript
{
  status: 200
  Place
}
{
  status: 400
  Condition error
}
```


> **`POST  /battleship/attack?id=""&shipType=""&coordinate=""`** 

attack ship

Key | Value | Example
------------ | ------------- | -------------
id | ObjectId(required) | 
coordinate | Array(required) | {row: 1, col: 2}
```javascript
{
  status: 200
  Hit/Miss/You just sunk .../Game over
}
{
  status: 400
  Condition error
}
```
