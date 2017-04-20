import React, { Component } from 'react';
import './InfoPanel.css'

class InfoPanel extends React.Component {
  render() {
    let player = this.props.player;

    return(
      <div className="InfoPanel">
        <p>InfoPanel (to be styled once development is to be finalised)</p>
        <p><strong>Player Info</strong> x: {player.x} y: {player.y} Level: {player.level} XP: {player.xp} HP: {player.hp}/{player.mhp} Weapon: {player.weapon}</p>
      </div>
    );
  }
};

export default InfoPanel
