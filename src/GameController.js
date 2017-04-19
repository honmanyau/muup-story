import React, {Component} from 'react';
import './GameController.css'
import Tile from './Tile.js'
import Map from './Map.js'
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
    this.tileSize = 20;
    this.levelWrapperSize = 40;

    this.state = {
      map: [],
      curLevel: 1,
      playerY: 0,
      playerX: 0
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

    logic.generateLevel(map, this.mapSize, this.minRoomSize, this.maxRoomSize, this.marginVariability, this.corridorAmountBias);
    playerPosition = logic.placePlayer(map);

    this.setState({
      map: map,
      playerY: playerPosition.y,
      playerX: playerPosition.x
    });
  }

  handleUserInput(event) {
    let map = this.state.map.slice(0);
    let key = event.which || event.keyCode;
    let playerY = this.state.playerY;
    let playerX = this.state.playerX;
    let playerNextY = 0;
    let playerNextX = 0;

    switch(key) {
        // Left key
      case 37:
        playerNextY = playerY;
        playerNextX = playerX - 1;
        break;
        // Up key
      case 38:
        playerNextY = playerY - 1;
        playerNextX = playerX;
        break;
      case 39:
        playerNextY = playerY;
        playerNextX = playerX + 1;
        break;
      case 40:
        playerNextY = playerY + 1;
        playerNextX = playerX;
        break;
    }

    if (map[playerNextY][playerNextX].terrain > 1) {
      map[playerY][playerX].player = "false";
      map[playerNextY][playerNextX].player = "true";

      this.setState({
        map: map,
        playerY: playerNextY,
        playerX: playerNextX
      });
    }
  }

  render() {
    let s = this.tileSize;
    let wrapperCenter = this.levelWrapperSize * s / 2;
    let tileOffset = s / 2;
    let offsetY = wrapperCenter - this.state.playerY * s - tileOffset;
    let offsetX = wrapperCenter - this.state.playerX * s - tileOffset;

    // This ensures that the player is always in focus and at the middle of the levelWrapper
    let mapOffsetStyles = {
      height: this.mapSize * s,
      width: this.mapSize * s,
      top: offsetY,
      left: offsetX
    }

    let levelWrapperStyles = {
      height: this.levelWrapperSize * s,
      width: this.levelWrapperSize * s
    }

    return (
      <div className="GameController-gameContainer">
        <div className="GameController-levelWrapper" style={levelWrapperStyles}>
          <Map map={this.state.map} style={mapOffsetStyles} />
          <div className="GameController-fog" style={levelWrapperStyles}></div>
        </div>
      </div>
    );
  }
};

export default GameController
