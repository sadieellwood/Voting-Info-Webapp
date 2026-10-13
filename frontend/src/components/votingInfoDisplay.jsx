import fakeData from "./fakeData.json";
import VotingMap from "./Maps";

const VotingInfoDisplay = ({ voterInfo, voterPosition }) => {
  const pollPositions = [
    {
      lat: fakeData.pollingLocations[0].latitude,
      lng: fakeData.pollingLocations[0].longitude,
    },
  ];

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
          pollPosition={pollPosition}
          addrPosition={voterPosition}
        ></VotingMap>
      </div>
    </div>
  );
};

export default VotingInfoDisplay;
