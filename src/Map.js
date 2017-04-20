import React, { Component } from 'react';
import Tile from './Tile.js'
import './Map.css';

// This class is used purely for rendering the map array generated by logic.generateLevel
class Map extends React.Component {
  render() {
    let renderedMap = this.props.map.map((row, index) => {
      return (
        <div className={"Map-row"} data-row={index}>
          {
            row.map((tile) => {
              return <Tile y={tile.y} x={tile.x} terrain={tile.terrain} roomId={tile.roomId} player={tile.player} objectId={tile.object.id} />
            })
          }
        </div>
      );
    });

    return(
      <div className="Map" style={this.props.style}>{renderedMap}</div>
    );
  };
}

export default Map;
