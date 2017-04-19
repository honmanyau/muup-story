export function generateLevel(map, mapSize, minRoomSize, maxRoomSize, marginVariability, corridorAmountBias) {
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
          player: "false"
        });
      }
      // Once a row is filled, push it into the map array
      map.push(row);
    };
  }

  // Function for creating a room with a randomly-sized margin, the maximum possible size is determined by roomScan()
  function createRoom(size, originY, originX) {
    let margin = Math.floor(Math.random() * marginVariability);
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



export function placeObject(map, object) {
  let mapSize = map.length;
  let tileNotFound = true;
  let objectY = 0;
  let objectX = 0;

  while (tileNotFound) {
    objectY = Math.floor(Math.random() * mapSize);
    objectX = Math.floor(Math.random() * mapSize);
    let tile = map[objectY][objectX];

    if (tile.terrain === 2) {
      switch(object) {
        case "player":
          tile.player = "true";
          tileNotFound = false;
          break;
        default:
          break;
      }
    }
  }

  return {y: objectY, x: objectX}
}
