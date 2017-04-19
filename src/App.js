import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Grid from './Grid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>The Adventure of Muup</h1>
        <Grid x="1" y="1" terrain="0" roomId="0" player="0" />
      </div>
    );
  }
}

export default App;
