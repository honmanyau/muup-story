export function generateLevel(map, mapSizeY, mapSizeX, minRoomSize, maxRoomSize, marginVariability, corridorAmountBias) {
  let roomList = [];

  // Function for generating the level as an array according to the sizes specified in GameController
  function createMapArray() {
    for (let y = 0; y < mapSizeY; y++) {
      let row = [];
      let terrain = 0;
      let roomId = 0;
      let player = 0;

      for (let x = 0; x < mapSizeX; x++) {
        row.push([y, x, terrain, roomId, player]);
      }
      // Once a row is filled, push it into the map array
      map.push(row);
    };
  }

  // Function for creating a room with a randomly-sized margin, the maximum possible size is determined by roomScan()
  function createRoom(size, originY, originX) {
    let margin = Math.floor(Math.random() * marginVariability);
    //let margin = 1;
    let roomId = 0;

    size = minRoomSize + Math.floor(Math.random() * (size - minRoomSize + 1));

    // The third item of an array that represents a grid sets the terrain of  grid
    for (let y = originY; y < originY + size; y++) {
      for (let x = originX; x < originX + size; x++) {
        let terrain = 2;
        roomId = roomList.length + 1;

        if (y < margin + originY || x < margin + originX || y > originY + size - margin - 1 || x > originX + size - margin - 1) {
          terrain = 1;
          roomId = 0;
        }

        map[y][x][2] = terrain;
        map[y][x][3] = roomId;
      }
    };

    // Room format [roomId, size of room, y-coordinate of the origin, x-coordinate of the origin, array of connected rooms]
    roomId = roomList.length + 1;
    roomList.push([
      roomId, size - margin * 2,
      originY + margin,
      originX + margin,
      []
    ]);
  }

  // Find the largest room size that can be made from the coordinates supplied
  function roomScan(gridY, gridX) {
    let size = 0;
    let availableSizes = [];

    if (gridY < map.length && gridX < map.length && map[gridY][gridX][2] === 0) {
      for (let roomSize = minRoomSize; roomSize < maxRoomSize; roomSize++) {
        let roomAvailable = true;

        for (let feelerY = gridY; feelerY < gridY + roomSize; feelerY++) {
          for (let feelerX = gridX; feelerX < gridX + roomSize; feelerX++) {
            if (feelerY > map.length - 1 || feelerX > map.length - 1 || map[feelerY][feelerX][2] !== 0) {
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
  // That are directly facing the current room in question is returned
  function corridorScan(room, direction) {
    let roomId = room[0];
    let roomSize = room[1];
    let roomOriginY = room[2];
    let roomOriginX = room[3];
    let connectedRooms = room[4];

    let continueScan = true;
    let connectables = [];

    let roomOriginI = 0;
    let roomOriginJ = 0;
    let addRoomSize = 0;
    let addScanSize = 0;

    switch (direction) {
      case "right":
        roomOriginI = roomOriginY;
        roomOriginJ = roomOriginX;
        addRoomSize = 1;
        addScanSize = 1;
        break;
      case "left":
        roomOriginI = roomOriginY;
        roomOriginJ = roomOriginX;
        addRoomSize = 0;
        addScanSize = -1;
        break;
      case "top":
        roomOriginI = roomOriginX;
        roomOriginJ = roomOriginY;
        addRoomSize = 0;
        addScanSize = -1;
        break;
      case "bottom":
        roomOriginI = roomOriginX;
        roomOriginJ = roomOriginY;
        addRoomSize = 1;
        addScanSize = 1;
        break;
    }

    for (let scanSize = 1; continueScan; scanSize++) {
      for (let i = roomOriginI; i < roomOriginI + roomSize; i++) {
        let j = roomOriginJ + (roomSize - 1) * addRoomSize + scanSize * addScanSize;

        if (i < 0 || j < 0 || i > map.length - 1 || j > map.length - 1) {
          continueScan = false;
          break;
        }

        if (direction == "right" || direction == "left") {
          if (map[i][j][3] !== 0) {
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
          if (map[j][i][3] !== 0) {
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
        let curRoomId = room[0];
        let randomNode = side[Math.floor(Math.random() * side.length)];
        let nextRoomId = randomNode[0][3];
        let doNotSkip = true;

        // Randomly skip making a path if the room is already connceted to two unique rooms.  Because of how the code is
        // currently structured, doing this gives priority to rooms that are situated, with respect to the current room,
        // in this order: right, bottom, left, top (not proven):
        if (room[4].length > 1) {
          let num = Math.random();

          if (num > corridorAmountBias) {
            doNotSkip = false;
          }
        }

        // Make sure that the rooms are not already connected
        if (doNotSkip && room[4].indexOf(nextRoomId) == -1) {
          let nodeY = randomNode[0][0];
          let nodeX = randomNode[0][1];
          let corY = randomNode[1][0];
          let corX = randomNode[1][1];
          let corYAbs = Math.abs(corY);
          let corXAbs = Math.abs(corX);

          // Connect the rooms
          if (corY === 0) {
            let incX = corX / corXAbs;

            for (let x = nodeX + incX; x != nodeX + corX; x += incX) {
              map[nodeY][x][2] = 2;
            }
          }

          if (corX === 0) {
            let incY = corY / corYAbs;

            for (let y = nodeY + incY; y != nodeY + corY; y += incY) {
              map[y][nodeX][2] = 2;
            }
          }

          // Modify roomList to reflect the connection of these rooms
          roomList[curRoomId - 1][4].push(nextRoomId);
          roomList[nextRoomId - 1][4].push(curRoomId);
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
} // generateLevel(map) {
