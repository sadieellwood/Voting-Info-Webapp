import React from "react";
import VoterInfo from "./components/AddressPage";
import TestMap from "./components/testMap";
import VotingMap from "./components/Maps";
import fakeData from "./components/fakeData.json";

const App = () => {
  const pollPositions = fakeData.pollingLocations;
  const addrPosition = { lat: 34.0522, lng: -118.2437 };
  return (
    <div className="App">
      <main>
        <VoterInfo></VoterInfo>
      </main>
    </div>
  );
};

export default App;
