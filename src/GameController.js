import React, {Component} from 'react';
import './GameController.css'
import DialogueBox from './DialogueBox'
import InfoPanel from './InfoPanel.js'
import Map from './Map.js'
import * as logic from './logic.js'
import * as assets from './assets.js'

const initialPlayer = {
  id: "player",
  name: null,
  x: 0,
  y: 0,
  level: 1,
  xp: 0,
  mhp: 50,
  hp: 50,
  attack: 10,
  weapon: "Body slam",
  weaponId: "",
  weaponAttack: 9
};

const initialDialogue = {
  object: null,
  progress: null,
  character: null,
  text: null
};

class GameController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: [],
      stage: 5,
      player: initialPlayer,
      inDialogue: false,
      dialogue: initialDialogue
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
    //this.generateNewlevel(this.state.stage);
    this.generateNewlevel(this.state.stage);
  }

  generateNewlevel(stage) {
    let map = [];
    let playerPosition = {};
    let player = JSON.parse(JSON.stringify(this.state.player));
    let flags = {
      changeLevel: false,
      inDialogue: this.state.inDialogue
    };
    let dialogue = JSON.parse(JSON.stringify(this.state.dialogue));

    this.tileSize = 40;
    this.levelWrapperSize = 14;
    this.mapSize = 30;
    this.minRoomSize = 7;
    this.maxRoomSize = 12;
    this.staticMargin = 0;
    this.marginVariability = 4;
    // Number between 0 (inclusive) to 1 (exclusive) that determines the probability of whether or not a room can
    // have more than two unique corridors
    this.corridorAmountBias = 0.3;

    if (stage === 0 || stage === 5) {
      // Can be tidied up here
      this.mapSize = 15;
      this.minRoomSize = 15;
      this.maxRoomSize = 16;
      this.staticMargin = 1;
      this.marginVariability = 0;
      this.corridorAmountBias = 0;

      logic.generateMap(map, this.mapSize, this.minRoomSize, this.maxRoomSize, this.staticMargin, this.marginVariability, this.corridorAmountBias);
      logic.decorateMap(map, stage, player, flags, dialogue);
    }
    else {
      logic.generateMap(map, this.mapSize, this.minRoomSize, this.maxRoomSize, this.staticMargin, this.marginVariability, this.corridorAmountBias);
      logic.decorateMap(map, stage, player, flags, dialogue);
    }

    this.setState({
      map: map,
      player: player,
      inDialogue: flags.inDialogue,
      dialogue: dialogue,
    });
  }

  handleUserInput(event) {
    let map = this.state.map.slice(0);
    let stage = this.state.stage;
    let key = event.which || event.keyCode;
    let player = JSON.parse(JSON.stringify(this.state.player));
    let flags = {
      changeLevel: false,
      inDialogue: this.state.inDialogue
    };
    let dialogue = JSON.parse(JSON.stringify(this.state.dialogue));

    logic.handleUserInput(key, map, stage, player, flags, dialogue);

    if (flags.changeLevel) {
      let nextStage = this.state.stage + 1;

      this.setState({
        stage: nextStage,
      });

      this.generateNewlevel(nextStage);
    }
    else if (player.hp < 1) {
      this.generateNewlevel(0);
    }
    else {
      this.setState({
        map: map,
        player: player,
        inDialogue: flags.inDialogue,
        dialogue: dialogue
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
        <InfoPanel player={player} stage={this.state.stage} />
        <div className="GameController-levelWrapper" style={levelWrapperStyles}>
          <Map map={this.state.map} style={mapOffsetStyles} />
          <div className="GameController-fog" style={levelWrapperStyles}></div>
        </div>
        <DialogueBox dialogue={this.state.dialogue} />
      </div>
    );
  }
};

export default GameController
