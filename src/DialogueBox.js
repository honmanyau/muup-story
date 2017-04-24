import React, { Component } from 'react';
import './DialogueBox.css'

class DialogueBox extends React.Component {
  render() {
    let dialogue = this.props.dialogue;
    let semicolon = null;

    if (dialogue.progress !== null && dialogue.character !== null) {
      semicolon = ":";
    }


    return(
      <div className="DialogueBox">
        <h3><strong>{dialogue.character}</strong>{semicolon} {dialogue.text}</h3>
      </div>
    );
  }
};

export default DialogueBox
