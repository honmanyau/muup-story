import React, {Component} from 'react';
import './GameController.css';
import StartScreen from './StartScreen';
import DialogueBox from './DialogueBox';
import TestPanel from './TestPanel.js';
import InfoPanel from './InfoPanel.js';
// import Map from './Map.js';
import PMap from './PMap.js';
import * as logic from './logic.js';
import * as assets from './assets.js';

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

    this.tileSize = 40;
    this.levelWrapperY = 12;
    this.levelWrapperX = 18;

    this.state = {
      showStartScreen: true,
      mode: null,
      map: [],
      floor: 0,
      player: initialPlayer,
      inDialogue: false,
      dialogue: initialDialogue
    };

    this.handleStartScreenInput = this.handleStartScreenInput.bind(this);
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
  }

  handleStartScreenInput(mode) {
    this.setState({
      showStartScreen: false,
      mode: mode
    }, function() {
      this.generateNewlevel(this.state.floor);
    });
  }

  generateNewlevel(floor) {
    let map = [];
    let playerPosition = {};
    let player = JSON.parse(JSON.stringify(this.state.player));
    let flags = {
      changeLevel: false,
      inDialogue: this.state.inDialogue
    };
    let dialogue = JSON.parse(JSON.stringify(this.state.dialogue));

    this.mapSize = 30;
    this.minRoomSize = 8;
    this.maxRoomSize = 12;
    this.staticMargin = 0;
    this.marginVariability = 3;
    this.corridorAmountBias = 0.3;

    if (this.state.mode === "story" && floor === 0 || floor === 5) {
      this.mapSize = 15;
      this.minRoomSize = 15;
      this.maxRoomSize = 16;
      this.staticMargin = 1;
      this.marginVariability = 0;
      this.corridorAmountBias = 0;
    }

    logic.generateMap(map, this.mapSize, this.minRoomSize, this.maxRoomSize, this.staticMargin, this.marginVariability, this.corridorAmountBias);

    logic.decorateMap(map, floor, player, flags, dialogue, this.state.mode);

    this.setState({
      map: map,
      player: player,
      inDialogue: flags.inDialogue,
      dialogue: dialogue,
    });
  }

  handleUserInput(event) {
    let map = this.state.map.slice(0);
    let floor = this.state.floor;
    let key = event.which || event.keyCode;
    let player = JSON.parse(JSON.stringify(this.state.player));
    let flags = {
      changeLevel: false,
      inDialogue: this.state.inDialogue,
      returnToTitle: false
    };
    let dialogue = JSON.parse(JSON.stringify(this.state.dialogue));

    logic.handleUserInput(key, map, floor, player, flags, dialogue);

    if (flags.changeLevel) {
      let nextFloor = this.state.floor + 1;

      this.setState({
        floor: nextFloor
      });

      this.generateNewlevel(nextFloor);
    }
    else if (player.hp === 0 && flags.inDialogue === false) {
      this.setState({
        showStartScreen: true,
        player: initialPlayer,
        floor: 0,
        inDialogue: false,
        dialogue: initialDialogue
      });
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
    let mapSize = this.mapSize;

    let unscaledDiagonal = Math.sqrt(2 * Math.pow(tileSize, 2));
    let mapCenterOffsetY = (this.levelWrapperY - mapSize) * tileSize / 2;
    let mapCenterOffsetX = (this.levelWrapperX - mapSize) * tileSize / 2;
    let playerYOffset = ((player.y + player.x) - (mapSize - 1)) / 2 * unscaledDiagonal * Math.cos(54.7 * Math.PI / 180);
    let playerXOffset = ((mapSize - 1) / 2 - player.y + player.x - (mapSize - 1) / 2) / 2 * unscaledDiagonal;

    /*
    //Non-perspective version—reserved for testing.  Must use Map.js instead of PMap.js.  Change the variable of styles for the map component accordingly.
    // These ensure that the player is always in focus and at the middle of the levelWrapper
    let wrapperCenter = this.levelWrapperSize * tileSize / 2;
    let tileOffset = tileSize / 2;

    let mapOffsetStyles = {
      height: this.mapSize * tileSize,
      width: this.mapSize * tileSize,
      top: wrapperCenter - player.y * tileSize - tileOffset,
      left: wrapperCenter - player.x * tileSize - tileOffset
    }
    */

    // These ensure that the player is always in focus and at the middle of the levelWrapper
    let pMapOffsetStyles = {
      height: mapSize * tileSize,
      width: mapSize * tileSize,
      top: mapCenterOffsetY - playerYOffset,
      left: mapCenterOffsetX - playerXOffset
    }
    // This allows the size of the playing field to be modified by changing this.mapSize and this.tileSize
    let levelWrapperStyles = {
      height: this.levelWrapperY * tileSize,
      width: this.levelWrapperX * tileSize
    }


    let gameWrapperContent = null;

    if (this.state.showStartScreen) {
      gameWrapperContent = <StartScreen onStartScreenButtonClick={this.handleStartScreenInput} />;
    }
    else {
      gameWrapperContent = [
        <InfoPanel player={player} floor={this.state.floor} />,
        <PMap map={this.state.map} style={pMapOffsetStyles} />,
        <div className="GameController-fog" style={levelWrapperStyles}></div>,
        <DialogueBox dialogue={this.state.dialogue} />
      ];
    }

    return (
      <div className="GameController-mainContainer">
        <div className="GameController-gameWrapper" style={levelWrapperStyles}>
          {gameWrapperContent}
        </div>
      </div>
    );
  }
};

export default GameController
