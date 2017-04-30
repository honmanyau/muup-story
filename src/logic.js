import * as assets from './assets.js';
// All parameters used in the functions here are always passed from GameController.js

const initialObject = {
  id: null,
  dialogueid: null
};



export function JSONClone(object) {
  let newObject = JSON.parse(JSON.stringify(object));

  return newObject;
}



export function generateMap(map, mapSize, reserveEdge, minRoomSize, maxRoomSize, staticMargin, marginVariability, corridorAmountBias) {
  let roomList = [];

  // Function for generating the level as an array according to the sizes specified in GameController
  function createMapArray() {
    for (let y = 0; y < mapSize; y++) {
      let row = [];

      for (let x = 0; x < mapSize; x++) {
        let terrain = 0;

        // Disallow allow traversable tiles at the edges, can be disabled in GameController.js with this.reserveEdge
        if (reserveEdge) {
          if (y === 0 || x === 0 || y === mapSize - 1 || x === mapSize -1) {
            terrain = 1;
          }
        }

        row.push({
          y: y,
          x: x,
          terrain: terrain,
          roomId: 0,
          player: "false",
          object: initialObject
        });
      }

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
      for (let roomSize = minRoomSize; roomSize <= maxRoomSize; roomSize++) {
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

  };

  createMapArray();

  // Make rooms
  for (let mapY = 0; mapY < map.length; mapY++) {
    for (let mapX = 0; mapX < map.length; mapX++) {
      let availableSizes = [];
      let roomSize = roomScan(mapY, mapX);

      if (roomSize !== 0) {
        createRoom(roomSize, mapY, mapX)
      }
    };
  };

  // Make corridors
  roomList.forEach(function(room) {
    generateCorridor(room);
  });

  return map;
};



export function changeDialogue(map, dialogueid, objectId, objectCoor = []) {
  if (objectCoor.length !== 2) {
    for (var y = 0; y < map.length; y++) {
      let tileFound = false;

      for (var x = 0; x < map.length; x++) {
        let tile = map[y][x];

        if (tile.object.id === objectId) {
          tile.object.dialogueid = dialogueid;

          tileFound = true;

          break;
        }
      }

      if (tileFound) {
        break;
      }
    }
  }
  else if (objectCoor.length === 2) {
    let tile = map[objectCoor[0]][objectCoor[1]];

    tile.object.dialogueid = dialogueid;
  }
}



export function removeDialogue(map, dialogueid, objectId, objectCoor = []) {
  if (objectCoor.length !== 2) {
    for (var y = 0; y < map.length; y++) {
      let tileFound = false;

      for (var x = 0; x < map.length; x++) {
        let tile = map[y][x];

        if (tile.object.id === objectId) {
          tile.object.dialogueid = null;

          tileFound = true;

          break;
        }
      }

      if (tileFound) {
        break;
      }
    }
  }
  else if (objectCoor.length === 2) {
    let tile = map[objectCoor[0]][objectCoor[1]];

    tile.object.dialogueid = null;
  }
}



export function placeObject(map, floor, player, newObjectType, newObjectId, count = 1, coor = [], dialogueid = null) {
  let mapSize = map.length;

  for (let i = 0; i < count; i++) {
    let tileNotFound = true;

    while (tileNotFound) {
      let objectY = Math.floor(Math.random() * mapSize);
      let objectX = Math.floor(Math.random() * mapSize);

      if (coor.length === 2) {
        objectY = coor[0];
        objectX = coor[1];
      }

      let neighboursClear = true;

      for (let y = objectY - 1; y < objectY + 2; y++) {
        for (let x = objectX - 1; x < objectX + 2; x++) {
          if (y < 0 || x < 0 || y > map.length - 1 || x > map.length - 1) {
            neighboursClear = false;
            break;
          }
          if (map[y][x].terrain !== 2) {
            neighboursClear = false;
            break;
          }
        }

        if (neighboursClear === false) {

        }
      }

      let tile = map[objectY][objectX];
      let allClear = tile.player === "false" && tile.object.id === null && neighboursClear;

      if (coor.length === 2 && allClear === false) {
        break;
      }

      if (tile.terrain === 2 && allClear) {
        switch(newObjectType) {
          case "player":
            tile.player = "true";
            player.x = objectX;
            player. y = objectY;
            tileNotFound = false;

            i = count;

            break;
          case "item":
            let item = JSONClone(assets.items[newObjectId]);

            if (item.scalable) {
              if (item.affected === "hp") {
                item.effect = Math.floor(player.hp * (0.40 + Math.random() * 0.2));
              }
            }

            if (dialogueid !== null) {
              item.dialogueid = dialogueid;
            }

            tile.object = item;

            break;
          case "enemy":
            let enemy = JSONClone(assets.enemies[newObjectId]);

            if (enemy.scalable) {
              let level = player.level + enemy.level;

              if (level < 1) {
                level = 1;
              }

              enemy.hp = Math.floor(11.6 * level + 9);
              enemy.attack = Math.floor(0.5 * level + 13);
              enemy.xp = Math.floor(30 + 4 * Math.exp(0.19 * level));
            }

            if (enemy.type === "Boss") {
              enemy.hp = (player.level + 10) * 10 + 40;
              enemy.attack = enemy.level + Math.floor(player.level * 1.1);
              enemy.xp = Math.floor(30 + 4 * Math.exp(0.19 * enemy.level)) * 5;
            }

            if (dialogueid !== null) {
              enemy.dialogueid = dialogueid;
            }

            tile.object = enemy;

            break;
          case "npc":
            tile.object = JSONClone(assets.npcs[newObjectId]);
            tile.object.dialogueid = dialogueid;

            break;
          // This is technically "cheating" because it's not exactly adding an object to the tile
          case "exit":
            tile.terrain = 99;

            break;
          default:
            break;
        }

        tileNotFound = false;
      }
    }
  }
}



function handleTrigger(map, floor, player, trigger) {
  switch(trigger.type) {
    case "placeObject":
      placeObject(map, floor, player, trigger.objecttype, trigger.objectid, trigger.objectamount, trigger.coordinates, trigger.dialogueid);

      break;
    case "changeDialogue":
      changeDialogue(map, trigger.dialogueid, trigger.objectid, trigger.coordinates);

      break;
    default:
      break;
  }
}



function updatePlayerStats(player) {
  let previousLevel = player.level;

  player.level = Math.floor(Math.log((player.xp + 165.5) / 165.5) * 5) + 1;
  player.mhp = player.level * 10 + 40;
  player.attack = player.level + player.weaponAttack;

  if (previousLevel !== player.level) {
    player.hp = player.mhp;
  }
}



export function handleDialogue(map, floor, player, flags, dialogue, object) {
  if (object !== undefined || dialogue.object !== null) {
    let dialogueSet = null;

    if (object !== undefined) {
      dialogue.object = object;
    }
    else if (object === undefined) {
      object = dialogue.object;
    }

    dialogueSet = assets.dialogues[object.dialogueid].content;
    let dialogueSetLength = Object.keys(dialogueSet).length;
    let curDialogueId = null;

    if (dialogue.progress === null) {
      curDialogueId = 0;
    }
    else {
      curDialogueId = dialogue.progress + 1;
    }

    if (curDialogueId < dialogueSetLength) {
      let curDialogue = dialogueSet[curDialogueId];
      let triggers = curDialogue.triggers;

      dialogue.progress = curDialogueId;
      dialogue.character = curDialogue.character;
      dialogue.text = curDialogue.text;

      if (triggers.length !== 0) {
        triggers.forEach((trigger) => {
          handleTrigger(map, floor, player, trigger);
        })
      }

      flags.inDialogue = true;
    }
    else if (curDialogueId === dialogueSetLength) {
      object.dialogueid = null;

      dialogue.object = null;
      dialogue.progress = null;
      dialogue.character = null;
      dialogue.text = null;

      flags.inDialogue = false;
    }
  }
}



export function handleUserInput(key, map, floor, player, flags, dialogue) {
  let playerNextY = 0;
  let playerNextX = 0;
  let curTile = map[player.y][player.x];
  let nextTile = null;
  let movementKeys = [37, 38, 39, 40, 65, 68, 83, 87];
  let isMovementKey = false;
  let triggerDialogue = false;

  if (movementKeys.indexOf(key) !== -1) {
    isMovementKey = true;

    switch(key) {
      // Left key
      case 37:
      case 65:
        playerNextY = player.y;
        playerNextX = player.x - 1;

        break;
      // Up key or W key
      case 38:
      case 87:
        playerNextY = player.y - 1;
        playerNextX = player.x;

        break;
      // Right key
      case 39:
      case 68:
        playerNextY = player.y;
        playerNextX = player.x + 1;

        break;
      // Down Key
      case 40:
      case 83:
        playerNextY = player.y + 1;
        playerNextX = player.x;

        break;
      default:
        break;
    }

    nextTile = map[playerNextY][playerNextX];
  }

  if (isMovementKey) {
    // If the tile is potentially traversable
    if (nextTile.terrain === 2 && flags.inDialogue === false && player.hp > 0) {
      let objectId = nextTile.object.id;
      let objectType = nextTile.object.type;
      let objectName = nextTile.object.name;

      let movePlayer = false;
      let clearObject = false;
      let replaceObject = null;

      // If it is an empty, traversable tile
      if (objectId === null) {
        movePlayer = true;
      }
      // Else if it contains a consumable item
      else if (objectId < 1000) {
        let item = nextTile.object;
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
          let weaponId = objectId;

          if (player.weaponId !== "") {
            replaceObject = player.weaponId;
          }

          player.weapon = objectName;
          player.weaponId = weaponId;
          player.weaponAttack = itemEffect;

          updatePlayerStats(player);
        }

        if (item.dialogueid !== null) {
          triggerDialogue = true;
        }

        clearObject = true;
        movePlayer = true;
      }
      // If the object is an enemy
      else if (objectId > 1000 && objectId < 2000) {
        let enemy = nextTile.object;

        // Decrease player HP
        player.hp = player.hp - Math.floor(enemy.attack * (0.85 + 0.15 * Math.random()));
        // Decrease enemy HP
        enemy.hp = enemy.hp - Math.floor(player.attack * (0.85 + 0.15 * Math.random()));

        // Player death is handled by GameController.js in handleUserInput()

        // Handling enemy death
        if (enemy.hp < 1) {
          player.xp = player.xp + enemy.xp;

          updatePlayerStats(player);

          if (enemy.dialogueid !== null) {
            triggerDialogue = true;
          }

          clearObject = true;
        }

        if (player.hp < 1) {
          player.hp = 0;

          handleDialogue(map, floor, player, flags, dialogue, {dialogueid: 3199});
        }
      }
      // If the object is an NPC
      else if (objectId > 9000 && objectId < 10000) {
        let npc = nextTile.object;

        if (npc.dialogueid !== null) {
          triggerDialogue = true;
        }
      }

      // Move the player and record the new position
      if (movePlayer && flags.inDialogue === false) {
        curTile.player = "false";
        nextTile.player = "true";
        player.y = playerNextY;
        player.x = playerNextX;
      }

      if (triggerDialogue) {
        handleDialogue(map, floor, player, flags, dialogue, nextTile.object);
      }

      // Clear the tile of the pervious object
      if (clearObject) {
        nextTile.object = initialObject;
      }

      // Drop the previous weapon if the player is already holding one
      if (replaceObject !== null) {
        nextTile.object = assets.items[replaceObject];
      }
    }
    else if (nextTile.terrain === 99) {
      console.log("nya")
      flags.changeLevel = true;
    }
  }
  else if (flags.inDialogue) {
    if (movementKeys.indexOf(key) === -1) {
      handleDialogue(map, floor, player, flags, dialogue);
    }
  }
}



export function decorateMap(map, floor, player, flags, dialogue, mode) {
  if (mode === "story") {
    if (floor === 0) {
      placeObject(map, floor, player, "player", player.id, 1, [7, 7]);
      placeObject(map, floor, player, "npc", "9001", 1, [5, 7], 3001);
    }
    else if (floor === 5) {
      placeObject(map, floor, player, "player", player.id, 1, [7, 7]);
      placeObject(map, floor, player, "enemy", "1199", 1, [4, 4]);
      placeObject(map, floor, player, "item", "101", 8);
      placeObject(map, floor, player, "item", "999", 1);
    }
    else if (floor === 6) {
      placeObject(map, floor, player, "player", player.id, 1, [7, 7]);
      placeObject(map, floor, player, "npc", "9001", 1, [5, 7], 3106);
    }
    else {
      let spawnWeaponId = "70" + floor;

      if (floor === 1) {
        player.weapon = "Caliburn Replica";
        player.weaponId = 700;
        player.weaponAttack = 9;

        updatePlayerStats(player);
      }

      // Trigger floor-specific dialogue at the beginning of ever flooor, id = 3101-3104
      if (floor > 0 && floor < 5) {
        let floorDialogueId = "310" + floor;

        handleDialogue(map, floor, player, flags, dialogue, {dialogueid: floorDialogueId});
      }

      placeObject(map, floor, player, "player", player.id);
      placeObject(map, floor, player, "item", "101", 20);
      placeObject(map, floor, player, "item", spawnWeaponId);

      placeObject(map, floor, player, "enemy", "1101", 5);
      placeObject(map, floor, player, "enemy", "1102", 10);
      placeObject(map, floor, player, "enemy", "1103", 15);
      placeObject(map, floor, player, "enemy", "1104", 10);
      placeObject(map, floor, player, "enemy", "1105", 5);

      placeObject(map, floor, player, "exit");
    }
  }
  else if (mode === "endless") {
    player.weapon = "Exalibur";

    if (floor > 0) {
      player.weapon = "Excalibur" + "+" + floor;
    }

    player.weaponId = null;
    player.weaponAttack = 9 + floor * 2;
    player.attack = player.weaponAttack + player.level;

    placeObject(map, floor, player, "player", player.id);
    placeObject(map, floor, player, "item", "101", 20);

    placeObject(map, floor, player, "enemy", "1101", 5);
    placeObject(map, floor, player, "enemy", "1102", 10);
    placeObject(map, floor, player, "enemy", "1103", 15);
    placeObject(map, floor, player, "enemy", "1104", 10);
    placeObject(map, floor, player, "enemy", "1105", 5);

    placeObject(map, floor, player, "exit");
  }
}
