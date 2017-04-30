import React, { Component } from 'react';
import './App.css';
import GameController from './GameController';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameController />
        <Footer />
      </div>
    );
  }
}

export default App;
