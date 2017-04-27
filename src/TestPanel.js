import React, { Component } from 'react';
import './GameController.css'

class TestPanel extends React.Component {
  render() {
    let player = this.props.player;

    const testPanelStyles = {
      gridArea: "3 / 2 / 3 / span 3",
      padding: "0 10px",
      textAlign: "center",
      backgroundColor: "none",
      border: "2px dashed #AAA"
    };

    return(
      <div className="GameController-testPanel" style={testPanelStyles}>
        <h2>Game Info</h2>
        <span><strong>Floor:</strong> {this.props.floor}</span>&nbsp;&nbsp;
        <span><strong>X:</strong> {player.x}</span>&nbsp;&nbsp;
        <span><strong>Y:</strong> {player.y}</span>&nbsp;&nbsp;
        <span><strong>Level:</strong> {player.level}</span>&nbsp;&nbsp;
        <span><strong>HP:</strong> {player.hp}/{player.mhp}</span>&nbsp;&nbsp;
        <span><strong>XP:</strong> {player.xp}</span>&nbsp;&nbsp;
        <span><strong>Weapon:</strong> {player.weapon}</span>&nbsp;&nbsp;
        <span><strong>Attacck:</strong> {player.attack}</span>&nbsp;&nbsp;
      </div>
    );
  }
};

export default TestPanel
