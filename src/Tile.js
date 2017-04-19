import React, { Component } from 'react';

class Tile extends React.Component {
  render() {
    return(
      <div className="Map-tile" data-x={this.props.x} data-y={this.props.y} data-terrain={this.props.terrain} data-roomId={this.props.roomId} data-player={this.props.player}></div>
    );
  }
};

export default Tile;
