import React, {Component} from 'react';
import './GameController.css'
import DialogueBox from './DialogueBox'
import InfoPanel from './InfoPanel.js'
import Map from './Map.js'
import * as logic from './logic.js'
import * as assets from './assets.js'

class GameController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: [],
      stage: 0,
      player: {
        id: "player",
        name: null,
        x: 0,
        y: 0,
        level: 1,
        XP: 0,
        mhp: 50,
        hp: 50,
        weapon: "Body slam",
        weaponId: "",
        attack: 10
      },
      inDialogue: false,
      dialogue: {
        progress: null,
        character: null,
        text: null
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
    this.generateNewlevel(this.state.stage);
  }

  generateNewlevel(level) {
    let map = [];
    let playerPosition = {};
    let player = JSON.parse(JSON.stringify(this.state.player));

    this.tileSize = 40;
    this.levelWrapperSize = 14;
    this.mapSize = 20;
    this.minRoomSize = 7;
    this.maxRoomSize = 12;
    this.staticMargin = 0;
    this.marginVariability = 3;
    // Number between 0 (inclusive) to 1 (exclusive) that determines the probability of whether or not a room can
    // have more than two unique corridors
    this.corridorAmountBias = 0.3;

    if (level === 0) {
      // Can be tidied up here
      this.mapSize = 15;
      this.minRoomSize = 15;
      this.maxRoomSize = 16;
      this.staticMargin = 1;
      this.marginVariability = 0;
      this.corridorAmountBias = 0;

      logic.generateLevel(map, this.mapSize, this.minRoomSize, this.maxRoomSize, this.staticMargin, this.marginVariability, this.corridorAmountBias);
      // Create the player character and write the coordinates to the player object for state-setting
      playerPosition = logic.placeObject(map, player, player.id, 1, [7, 7]);
      logic.placeObject(map, "item", "101", 1, [1, 1]);
      logic.placeObject(map, "item", "999", 1, [13, 1]);
      logic.placeObject(map, "npc", "9001", 1, [5, 7], 3001);
      logic.placeObject(map, "enemy", "1001", 1, [7, 9]);
      logic.placeObject(map, "exit", "", 1, [1, 13]);
    }
    else {
      logic.generateLevel(map, this.mapSize, this.minRoomSize, this.maxRoomSize, this.staticMargin, this.marginVariability, this.corridorAmountBias);
      // Create the player character and write the coordinates to the player object for state-setting
      playerPosition = logic.placeObject(map, player, player.id);
      // Create healing objcets
      logic.placeObject(map, "item", "101", 10);
      logic.placeObject(map, "item", "999");
      logic.placeObject(map, "exit");
    }

    this.setState({
      map: map,
      player: player
    });
  }

  handleUserInput(event) {
    let map = this.state.map.slice(0);
    let key = event.which || event.keyCode;
    let player = JSON.parse(JSON.stringify(this.state.player));
    let flags = {
      changeLevel: false,
      inDialogue: this.state.inDialogue
    };
    let dialogue = JSON.parse(JSON.stringify(this.state.dialogue));

    logic.handleUserInput(key, map, player, flags, dialogue);

    this.setState({
      inDialogue: flags.inDialogue,
      dialogue: dialogue
    });

    if (flags.changeLevel) {
      let nextStage = this.state.stage + 1;

      this.setState({
        stage: nextStage,
      });

      this.generateNewlevel(nextStage);
    }
    else {
      this.setState({
        map: map,
        player: player
      });
    }
  }

  render() {
    let player = JSON.parse(JSON.stringify(this.state.player));
    let tileSize = this.tileSize;
    let wrapperCenter = this.levelWrapperSize * tileSize / 2;
    let tileOffset = tileSize / 2;
    // These ensure that the player is always in focus and at the middle of the levelWrapper
    let mapOffsetStyles = {
      height: this.mapSize * tileSize,
      width: this.mapSize * tileSize,
      top: wrapperCenter - player.y * tileSize - tileOffset,
      left: wrapperCenter - player.x * tileSize - tileOffset
    }
    // This allows the size of the playing field to be modified by changing this.mapSize and this.tileSize
    let levelWrapperStyles = {
      height: this.levelWrapperSize * tileSize,
      width: this.levelWrapperSize * tileSize
    }

    return (
      <div className="GameController-gameContainer">
        <DialogueBox dialogue={this.state.dialogue} />
        <InfoPanel player={player} stage={this.state.stage} />
        <div className="GameController-levelWrapper" style={levelWrapperStyles}>
          <Map map={this.state.map} style={mapOffsetStyles} />
          <div className="GameController-fog" style={levelWrapperStyles}></div>
        </div>
      </div>
    );
  }
};

export default GameController
