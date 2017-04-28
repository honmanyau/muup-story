import React, { Component } from 'react';
import './PMap.css';

// This class is used purely for rendering the map array generated by logic.generateLevel
class PMap extends React.Component {
  render() {
    let renderedMap = this.props.map.map((row, rowIndex) => {
      return (
        <div className={"Map-row"} data-row={rowIndex}>
          {
            row.map((tile, tileIndex) => {
              let object = null;

              if (tile.object.id !== null || tile.player === "true") {
                object = <div className="Map-tileObject" data-player={tile.player} data-objectId={tile.object.id}></div>;
              }

              return (
                <div className="Map-tileWrapper">
                  <div className="Map-tile" data-x={tile.x} data-y={tile.y} data-terrain={tile.terrain} data-roomId={tile.roomId} data-dialogueId={tile.object.dialogueId}></div>
                  {object}
                </div>
              )
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

export default PMap;