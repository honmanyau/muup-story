import React, { Component } from 'react';
import './GameController.css'

class TestPanel extends React.Component {
  render() {
    let player = this.props.player;

    return(
      <div className="GameController-testPanel">
        <h2>Game Info</h2>
        <p><strong>Floor:</strong> {this.props.floor}</p>
        <p><strong>X:</strong> {player.x}</p>
        <p><strong>Y:</strong> {player.y}</p>
        <p><strong>Level:</strong> {player.level}</p>
        <p><strong>HP:</strong> {player.hp}/{player.mhp}</p>
        <p><strong>XP:</strong> {player.xp}</p>
        <p><strong>Weapon:</strong> {player.weapon}</p>
        <p><strong>Attacck:</strong> {player.attack}</p>
      </div>
    );
  }
};

export default TestPanel
