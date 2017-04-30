import React, { Component } from 'react';
import './GameController.css'

class DialogueBox extends React.Component {
  render() {
    let dialogue = this.props.dialogue;
    let semicolon = null;
    let visibility = "hidden";
    let textAlign = "left";

    if (dialogue.progress !== null) {
      if (dialogue.character !== null) {
        semicolon = ":";
      }
      else if (dialogue.character === null) {
        textAlign = "center";
      }

      visibility = "visible";
    }

    const dialogueBoxStyles = {
      visibility: visibility,
      textAlign: textAlign
    };

    return(
      <div className="GameController-dialogueBox" style={dialogueBoxStyles}>
        <p><strong>{dialogue.character}</strong>{semicolon} {dialogue.text}</p>
      </div>
    );
  }
};

export default DialogueBox
