import React, {Component} from 'react';
import './GameController.css'
import Tile from './Tile.js'
import Map from './Map.js'
import InfoPanel from './InfoPanel.js'
import * as logic from './logic.js'

class GameController extends React.Component {
  constructor(props) {
    super(props);

    this.mapSize = 40;
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
        hp: 50,
        weapon: "Body slam",
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
    playerPosition = logic.placeObject(map, "player");

    player.y = playerPosition.y;
    player.x = playerPosition.x;

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
      case 39:
        playerNextY = player.y;
        playerNextX = player.x + 1;
        break;
      case 40:
        playerNextY = player.y + 1;
        playerNextX = player.x;
        break;
    }

    if (map[playerNextY][playerNextX].terrain > 1 && map[playerNextY][playerNextX].terrain < 20) {
      map[player.y][player.x].player = "false";
      map[playerNextY][playerNextX].player = "true";

      player.y = playerNextY;
      player.x = playerNextX;

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
