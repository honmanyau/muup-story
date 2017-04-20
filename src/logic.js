import * as assets from './assets.js'
// All parameters used in the functions here are always passed from GameController.js

export function generateLevel(map, mapSize, minRoomSize, maxRoomSize, staticMargin, marginVariability, corridorAmountBias) {
  let roomList = [];

  // Function for generating the level as an array according to the sizes specified in GameController
  function createMapArray() {
    for (let y = 0; y < mapSize; y++) {
      let row = [];

      for (let x = 0; x < mapSize; x++) {
        // [y, x, terrain, roomId, player]
        row.push({
          y: y,
          x: x,
          terrain: 0,
          roomId: 0,
          player: "false",
          object: {
            id: ""
          }
        });
      }
      // Once a row is filled, push it into the map array
      map.push(row);
    };
  }

  // Function for creating a room with a randomly-sized margin, the maximum possible size is determined by roomScan()
  function createRoom(size, originY, originX) {
    let margin = staticMargin + Math.floor(Math.random() * marginVariability);
    let curRoomId = roomList.length + 1;

    size = minRoomSize + Math.floor(Math.random() * (size - minRoomSize + 1));

    // Loop through each of the tile that this room with size size and origin (top left corner) y and x to will cover
    // and change the corresponding tiles in the map array to have a terrain value that corresponds to a either a
    // regular room tile or a margin tile
    for (let y = originY; y < originY + size; y++) {
      for (let x = originX; x < originX + size; x++) {
        let terrain = 2;
        let roomId = curRoomId;

        if (y < margin + originY || x < margin + originX || y > originY + size - margin - 1 || x > originX + size - margin - 1) {
          terrain = 1;
          roomId = 0;
        }

        map[y][x].terrain = terrain;
        map[y][x].roomId = roomId;
      }
    };

    // Room format [roomId, size of room, y-coordinate of the origin, x-coordinate of the origin, array of connected rooms]
    roomList.push({
      roomId: curRoomId,
      size: size - margin * 2,
      y: originY + margin,
      x: originX + margin,
      connectedRooms: []
    });
  }

  // Find the largest room size that can be made from the coordinates supplied
  function roomScan(tileY, tileX) {
    let size = 0;
    let availableSizes = [];

    if (map[tileY][tileX].terrain === 0) {
      for (let roomSize = minRoomSize; roomSize < maxRoomSize; roomSize++) {
        let roomAvailable = true;

        for (let feelerY = tileY; feelerY < tileY + roomSize; feelerY++) {
          for (let feelerX = tileX; feelerX < tileX + roomSize; feelerX++) {
            if (feelerY > map.length - 1 || feelerX > map.length - 1 || map[feelerY][feelerX].terrain !== 0) {
              roomAvailable = false;
              break;
            }
          }
        }

        if (roomAvailable) {
          availableSizes.push(roomSize);
        }
      }
    }

    if (availableSizes.length !== 0) {
      size = Math.max(...availableSizes);
    }

    return size;
  };

  // Function for deducing the rooms that are closest to each face of a room.  If a room is found by the scan, a list of tiles
  // that are directly facing the current room in question is returned.  The list of tile, which are refered to as connectables
  // are formatted as  [tile object = map[y][x], [y-distance to tile, x-distance to tile]].  Note that the actual cooridor length
  // will either be y-distance to tile - 1 (top, bottom) or x-distance to tile - 1 (left, right)
  function corridorScan(room, direction) {
    let continueScan = true;
    let connectables = [];

    let roomOriginI = 0;
    let roomOriginJ = 0;
    let addRoomSize = 0;
    let addScanSize = 0;

    switch (direction) {
      case "right":
        roomOriginI = room.y;
        roomOriginJ = room.x;
        addRoomSize = 1;
        addScanSize = 1;
        break;
      case "left":
        roomOriginI = room.y;
        roomOriginJ = room.x;
        addRoomSize = 0;
        addScanSize = -1;
        break;
      case "top":
        roomOriginI = room.x;
        roomOriginJ = room.y;
        addRoomSize = 0;
        addScanSize = -1;
        break;
      case "bottom":
        roomOriginI = room.x;
        roomOriginJ = room.y;
        addRoomSize = 1;
        addScanSize = 1;
        break;
    }

    for (let scanSize = 1; continueScan; scanSize++) {
      for (let i = roomOriginI; i < roomOriginI + room.size; i++) {
        let j = roomOriginJ + (room.size - 1) * addRoomSize + scanSize * addScanSize;

        if (i < 0 || j < 0 || i > map.length - 1 || j > map.length - 1) {
          continueScan = false;
          break;
        }

        if (direction == "right" || direction == "left") {
          if (map[i][j].roomId !== 0) {
            let corridorSize = scanSize;

            if (direction == "right") {
              corridorSize *= -1;
            }

            connectables.push([
              map[i][j],
              [0, corridorSize]
            ]);
          }
        }

        if (direction == "top" || direction == "bottom") {
          if (map[j][i].roomId !== 0) {
            let corridorSize = scanSize;

            if (direction == "bottom") {
              corridorSize *= -1;
            }

            connectables.push([
              map[j][i],
              [corridorSize, 0]
            ]);
          }
        }
      }

      if (connectables.length !== 0) {
        continueScan = false;
      }
    } // for (let scanSize = 1; continueScan; scanSize++) {

    return connectables
  } // function scanSideways(room, direction) {

  function generateCorridor(room) {
    let connectables = [
      corridorScan(room, "right"),
      corridorScan(room, "bottom"),
      corridorScan(room, "left"),
      corridorScan(room, "top")
    ];

    connectables.forEach(function(side, index) {
      if (side.length !== 0) {
        let randomNode = side[Math.floor(Math.random() * side.length)];
        let nextRoomId = randomNode[0].roomId;
        let doNotSkip = true;

        // Randomly skip making a path if the room is already connceted to two unique rooms.  Because of how the code is
        // currently structured, doing this gives priority to rooms that are situated, with respect to the current room,
        // in this order: right, bottom, left, top (not proven):
        if (room.connectedRooms.length > 1) {
          let num = Math.random();

          if (num > corridorAmountBias) {
            doNotSkip = false;
          }
        }

        // Make sure that the rooms are **not** already connected
        if (doNotSkip && room.connectedRooms.indexOf(nextRoomId) == -1) {
          let nodeY = randomNode[0].y;
          let nodeX = randomNode[0].x;
          let corY = randomNode[1][0];
          let corX = randomNode[1][1];
          let corYAbs = Math.abs(corY);
          let corXAbs = Math.abs(corX);

          // Connect the rooms
          if (corY === 0) {
            let incX = corX / corXAbs;

            for (let x = nodeX + incX; x != nodeX + corX; x += incX) {
              map[nodeY][x].terrain = 2;
            }
          }

          if (corX === 0) {
            let incY = corY / corYAbs;

            for (let y = nodeY + incY; y != nodeY + corY; y += incY) {
              map[y][nodeX].terrain = 2;
            }
          }

          // Modify roomList to reflect the connection of these rooms
          roomList[room.roomId - 1].connectedRooms.push(nextRoomId);
          roomList[nextRoomId - 1].connectedRooms.push(room.roomId);
        }
      }
    });

  }; // function generateCorridor(room) {


  // Generate the world as an array
  createMapArray()

  // Make rooms
  for (let mapY = 0; mapY < map.length; mapY++) {
    for (let mapX = 0; mapX < map.length; mapX++) {
      let availableSizes = [];
      let roomSize = roomScan(mapY, mapX);

      console.log(roomSize)

      if (roomSize !== 0) {
        createRoom(roomSize, mapY, mapX)
      }
    }
  }

  // Make corridors
  roomList.forEach(function(room) {
    generateCorridor(room);
  });

  return map;
}; // generateLevel(map) {



export function placeObject(map, object, objectId, count = 1, coor = []) {
  let mapSize = map.length;

  for (let i = 0; i < count; i++) {
    let tileNotFound = true;

    while (tileNotFound) {
      let objectY = Math.floor(Math.random() * mapSize);
      let objectX = Math.floor(Math.random() * mapSize);

      if (coor.length !== 0) {
        objectY = coor[0];
        objectX = coor[1];
      }

      let tile = map[objectY][objectX];
      let allClear = tile.player === "false" && tile.object.id === "";

      if (tile.terrain === 2 && tile.object.id === "") {
        if (typeof object === "object" && allClear) {
          tile.player = "true";
          object.x = objectX;
          object.y = objectY;
          tileNotFound = false;
          // In case of the extremely rare chance that a player ever gets generated more than once
          // due to programmatic errors
          i = count;
        }
        else if (typeof object === "string" && allClear) {
          switch(object) {
            case "item":
              tile.object = assets.items[objectId];
              break;
            case "enemy":
              tile.object = assets.enemies[objectId];
            default:
              break;
          }

          tileNotFound = false;
        }
      }
    }
  }
}



export function handleUserInput(map, player, key) {
  let playerNextY = 0;
  let playerNextX = 0;

  switch(key) {
    // Left key
    case 37:
      playerNextY = player.y;
      playerNextX = player.x - 1;
      break;
    // Up key
    case 38:
      playerNextY = player.y - 1;
      playerNextX = player.x;
      break;
    // Right key
    case 39:
      playerNextY = player.y;
      playerNextX = player.x + 1;
      break;
    // Down Key
    case 40:
      playerNextY = player.y + 1;
      playerNextX = player.x;
      break;
  }

  let curTile = map[player.y][player.x];
  let nextTile = map[playerNextY][playerNextX];

  // If the tile is potentially traversable
  if (map[playerNextY][playerNextX].terrain === 2) {
    let objectId = nextTile.object.id;
    let objectType = nextTile.object.type;
    let objectName = nextTile.object.name;

    let movePlayer = false;
    let clearObject = false;
    let replaceObject = "";

    // If it is an empty, traversable tile
    if (objectId === "") {
      movePlayer = true;
    }
    // Else if it contains a consumable item
    else if (objectId < 1000) {
      let itemAffectedStat = nextTile.object.affected;
      let itemEffect = nextTile.object.effect;

      // If the affected stat is HP
      if (itemAffectedStat === "hp") {
        let maxHP = player.mhp;

        player[itemAffectedStat] = player[itemAffectedStat] + itemEffect;

        // Maintain HP below Max HP
        if (player[itemAffectedStat] > maxHP) {
          player[itemAffectedStat] = maxHP;
        }
      }
      // If the item is a weapon
      else if (objectType === "Weapon"){
        let weaponId = "i" + objectId;

        if (player.weaponId !== "") {
          replaceObject  = player.weaponId;
        }

        player.weapon = objectName;
        player.weaponId = weaponId;
        player[itemAffectedStat] = player.level + itemEffect;
      }

      clearObject = true;
      movePlayer = true;
    }
    // If the object is an enemy
    else if (objectId > 1000 && objectId < 2000) {
      let enemy = nextTile.object;
      // Decrease player HP
      player.hp = player.hp - enemy.attack;
      // Decrease enemy HP
      enemy.hp = enemy.hp - player.attack;

      if (enemy.hp < 0) {
        clearObject = true;
        movePlayer = true;
      }

    }

    // Move the player and record the new position
    if (movePlayer) {
      curTile.player = "false";
      nextTile.player = "true";
      player.y = playerNextY;
      player.x = playerNextX;
    }

    // Clear the tile of the pervious object
    if (clearObject) {
      nextTile.object = {id: ""};
    }

    // Drop the previous weapon if the player is already holding one
    if (replaceObject !== "") {
      nextTile.object = assets.items[replaceObject];
    }
  }
}
