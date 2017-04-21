import React, { Component } from 'react';
import './DialogueBox.css'

class DialogueBox extends React.Component {
  render() {
    let dialogue = this.props.dialogue;
/*
    "0": {
      "character": "Alice",
      "characterid": 9001,
      "text": "Oh, hello there, little Muup! What brings you here today?"
    },
*/
    return(
      <div className="DialogueBox">
        <p><strong>Dialogues:</strong> Character: {dialogue.character} Text: {dialogue.text}</p>
      </div>
    );
  }
};

export default DialogueBox
