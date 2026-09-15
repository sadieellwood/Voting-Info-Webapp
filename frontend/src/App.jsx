import React from 'react';
import './App.css';
import VoterInfo from './components/voterInfo';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Voter Information</h1>
      </header>
      <main>
        <VoterInfo></VoterInfo>
      </main>
    </div>
  );
};

export default App;