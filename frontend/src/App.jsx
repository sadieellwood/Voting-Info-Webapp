import React from "react";
import VoterInfo from "./components/voterInfo";
import TestMap from "./components/testMap";

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
