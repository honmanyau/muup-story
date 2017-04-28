import React, { Component } from 'react';
import './StartScreen.css';

class StartScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleStoryModeButtonClick = this.handleStoryModeButtonClick.bind(this);
    this.handleEndlessModeButtonClick = this.handleEndlessModeButtonClick.bind(this);
  }

  handleStoryModeButtonClick() {
    this.props.onStartScreenButtonClick("story");
  }

  handleEndlessModeButtonClick() {
    this.props.onStartScreenButtonClick("endless");
  }

  render() {
    const startScreenWrapperStyles = {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      color: "white"
    };

    return(
      <div style={startScreenWrapperStyles}>
        <div>--Select Mode--</div>
        <div><button type="button" onClick={this.handleStoryModeButtonClick}>Story Mode</button></div>
        <div><button type="button" onClick={this.handleEndlessModeButtonClick}>Endless Mode</button></div>
      </div>
    );
  }
};

export default StartScreen
