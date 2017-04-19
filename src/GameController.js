import React, {Component} from 'react';
import Tile from './Tile.js'
import Map from './Map.js'
import * as logic from './logic.js'

class GameController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      map: [],
      playerY: 0,
      playerX: 0,
    };
  }

  componentDidMount() {
    let map = [];
    let mapSizeY = 40;
    let mapSizeX = 40;
    let minRoomSize = 7;
    let maxRoomSize = 12;
    // Number between 0 (inclusive) to 1 (exclusive) that determines the probability of whether or not a room can have more than
    // two unique corridors
    let marginVariability = 3;
    let corridorAmountBias = 0.3;

    logic.generateLevel(map, mapSizeY, mapSizeX, minRoomSize, maxRoomSize, marginVariability, corridorAmountBias);

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
