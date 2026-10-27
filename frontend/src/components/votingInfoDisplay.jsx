import fakeData from "./fakeData.json";
import VotingMap from "./Maps";

const VotingInfoDisplay = ({ voterInfo, voterPosition }) => {
  const pollPositions = fakeData.pollingLocations;
  console.log(pollPositions);
  return (
    <div>
      <h2>Your polling locations</h2>
      {/* <p>Election: {voterInfo?.election.name}</p>
      <p>Election Day: {voterInfo?.election.electionDay}</p>
      <p>Election ID: {voterInfo?.election.id}</p> */}
      <ul>
        {fakeData.pollingLocations.map((location) => (
          <li key={location.address.locationName}>
            {location.address.locationName}
          </li>
        ))}
      </ul>
      <div>
        <VotingMap
          pollPositions={pollPositions}
          addrPosition={voterPosition}
        ></VotingMap>
      </div>
    </div>
  );
};

export default VotingInfoDisplay;
