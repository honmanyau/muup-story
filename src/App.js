import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import GameController from './GameController'

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameController />
      </div>
    );
  }
}

export default App;
