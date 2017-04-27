import React, { Component } from 'react';
import './GameController.css'

class InfoPanel extends React.Component {
  render() {
    let player = this.props.player;
    let HPPercentage = player.hp / player.mhp * 100;

    let HPBarFillWidth = {
      width: HPPercentage + "%"
    };

    return(
      <div className="GameController-infoPanel">
        <div className="GameController-infoPanelLabel">{this.props.floor}<small>F</small></div>
        <div className="GameController-infoPanelLabel"><small>Lv</small>{player.level}</div>
        <div className="GameController-infoPanelLabel">
          <small>HP</small>{player.hp}/{player.mhp}
          <div className="GameController-infoPanelLabel-HPBar">
            <div className="GameController-infoPanelLabel-HPBarFill" style={HPBarFillWidth}></div>
          </div>
        </div>
        <div className="GameController-infoPanelLabel">
          <small>&#9876;</small>{player.attack}
          <div className="GameController-extraSmallText">Enhanced Excalibur</div>
        </div>
      </div>
    );
  }
};

export default InfoPanel
