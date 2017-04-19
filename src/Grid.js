import React, { Component } from 'react';

class Grid extends React.Component {
  render() {
    return(
      <div className="Grid" data-x={this.props.x} data-y={this.props.y} data-terrain={this.props.terrain} data-roomId={this.props.roomId} data-player={this.props.player}></div>
    );
  }
};

export default Grid;
