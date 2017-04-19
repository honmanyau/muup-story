import React, {Component} from 'react';
import Tile from './Tile.js'
import Map from './Map.js'
import * as logic from './logic.js'

class GameController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: [],
      curLevel: 1,
      playerY: 0,
      playerX: 0
    };

    this.generateNewlevel = this.generateNewlevel.bind(this);
  }

  componentDidMount() {
    this.generateNewlevel();
  }

  generateNewlevel() {
    let map = [];
    let mapSizeY = 30;
    let mapSizeX = 30;
    let minRoomSize = 7;
    let maxRoomSize = 12;
    // Number between 0 (inclusive) to 1 (exclusive) that determines the probability of whether or not a room can have more than
    // two unique corridors
    let marginVariability = 3;
    let corridorAmountBias = 0.3;

    logic.generateLevel(map, mapSizeY, mapSizeX, minRoomSize, maxRoomSize, marginVariability, corridorAmountBias);
    logic.placePlayer(map);

    this.setState({map: map});
  }

  render() {
    return (
      <div>
        <Map map={this.state.map} />
      </div>
    );
  }
};

export default GameController
