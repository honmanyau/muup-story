import React, {Component} from 'react';
import './GameController.css'
import Tile from './Tile.js'
import Map from './Map.js'
import InfoPanel from './InfoPanel.js'
import * as logic from './logic.js'

class GameController extends React.Component {
  constructor(props) {
    super(props);

    this.mapSize = 20;
    this.minRoomSize = 7;
    this.maxRoomSize = 12;
    this.marginVariability = 3;
    // Number between 0 (inclusive) to 1 (exclusive) that determines the probability of whether or not a room can have more than
    // two unique corridors
    this.corridorAmountBias = 0.3;
    this.tileSize = 40;
    this.levelWrapperSize = 14;

    this.state = {
      map: [],
      curLevel: 1,
      player: {
        x: 0,
        y: 0,
        level: 1,
        XP: 0,
        mhp: 50,
        hp: 20,
        weapon: "Body slam",
        weaponId: "none",
        attack: 10
      }
    };

    this.generateNewlevel = this.generateNewlevel.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleUserInput);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleUserInput);
  }

  componentDidMount() {
    this.generateNewlevel();
  }

  generateNewlevel() {
    let map = [];
    let playerPosition = {};
    let player = JSON.parse(JSON.stringify(this.state.player));

    logic.generateLevel(map, this.mapSize, this.minRoomSize, this.maxRoomSize, this.marginVariability, this.corridorAmountBias);
    // Create the player character and write the coordinates to the player object for state-setting
    playerPosition = logic.placeObject(map, "player");
    player.y = playerPosition.y;
    player.x = playerPosition.x;
    // Create healing objcets
    logic.placeObject(map, "item", "i101");
    logic.placeObject(map, "item", "i101");
    logic.placeObject(map, "item", "i999");
    logic.placeObject(map, "item", "i999");


    this.setState({
      map: map,
      player: player
    });
  }

  handleUserInput(event) {
    let map = this.state.map.slice(0);
    let key = event.which || event.keyCode;
    let player = JSON.parse(JSON.stringify(this.state.player));
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

    if (map[playerNextY][playerNextX].terrain > 1) {
      let itemName = nextTile.object.name;
      let itemAffectedStat = nextTile.object.affected;
      let itemEffect = nextTile.object.effect;
      let itemType = nextTile.object.type;

      let movePlayer = false;
      let clearObject = false;

      // If it is an empty, traversable tile
      if (nextTile.object.id === "none") {
        movePlayer = true;
      }
      // Else if it contains a consumable item
      else if (nextTile.object.id < 1000) {
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
        else if (itemType === "Weapon"){
          player.weapon = itemName;
          player[itemAffectedStat] = itemEffect;
        }

        clearObject = true;
        movePlayer = true;
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
        nextTile.object = {id: "none"};
      }

      this.setState({
        map: map,
        player: player
      });
    }
  }

  render() {
    let player = JSON.parse(JSON.stringify(this.state.player));
    let tileSize = this.tileSize;

    // These ensure that the player is always in focus and at the middle of the levelWrapper
    let wrapperCenter = this.levelWrapperSize * tileSize / 2;
    let tileOffset = tileSize / 2;
    let mapOffsetStyles = {
      height: this.mapSize * tileSize,
      width: this.mapSize * tileSize,
      top: wrapperCenter - player.y * tileSize - tileOffset,
      left: wrapperCenter - player.x * tileSize - tileOffset
    }

    // This allows the size of the playing field to be modified
    let levelWrapperStyles = {
      height: this.levelWrapperSize * tileSize,
      width: this.levelWrapperSize * tileSize
    }

    return (
      <div className="GameController-gameContainer">
        <InfoPanel player={player} />
        <div className="GameController-levelWrapper" style={levelWrapperStyles}>
          <Map map={this.state.map} style={mapOffsetStyles} />
          <div className="GameController-fog" style={levelWrapperStyles}></div>
        </div>
      </div>
    );
  }
};

export default GameController
