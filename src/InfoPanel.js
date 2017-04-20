import React, { Component } from 'react';
import './InfoPanel.css'

class InfoPanel extends React.Component {
  render() {
    let player = this.props.player;

    return(
      <div className="InfoPanel">
        <h3>InfoPanel (to be styled once development is to be finalised)</h3>
        <p><strong>Player Info</strong> x: {player.x} y: {player.y} Level: {player.level} XP: {player.xp} HP: {player.hp}/{player.mhp} Weapon: {player.weapon} Attack: {player.attack}</p>
      </div>
    );
  }
};

export default InfoPanel
