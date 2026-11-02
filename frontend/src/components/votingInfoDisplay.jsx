import fakeData from "./fakeData.json";
import VotingMap from "./Maps";
import { Navigate, useLocation } from "react-router-dom";
import { useState, createContext, useContext } from "react";

const PollContext = createContext();

const PollSpecficInformation = ({ pollingData }) => {
  const selectedPoll = useContext(PollContext);
  // would it be better to put API calls in here? in future with the tabs
  const dataNeeded = [""];
  return (
    <div>
      <p></p>
    </div>
  );
};

const VotingInfoDisplay = ({ voterInfo, voterPosition }) => {
  console.log(voterInfo);
  const votingLocations = voterInfo.locations;
  console.log(votingLocations);
  const [selectedPoll, setSelectedPoll] = useState(null);

  return (
    <PollContext.Provider value={selectedPoll}>
      <div className="bg-blue-400 flex h-screen w-full items-center justify-center ">
        <div className="flex flex-col w-full max-w-4xl gap-5">
          <div className="flex gap-3 h-20 w-full items-center overflow-hidden rounded-2xl bg-white px-8 shadow-xl">
            <img
              src="src/components/images/marker.jpg"
              alt="map marker icon"
              className="size-12"
            />
            <p className="flex items-center text-3xl font-bold text-gray-900">
              Your Polling Locations
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 border overflow-hidden rounded-2xl">
              <VotingMap
                votingLocations={votingLocations}
                addrPosition={voterPosition}
              ></VotingMap>
            </div>
            <div className="col-span-1 overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="flex flex-col text-m">
                {votingLocations.map((location) => (
                  <p className="px-10">{location.name}</p>
                ))}
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </PollContext.Provider>
  );
};

const VotingInfoPage = () => {
  const { state } = useLocation();

  //need to handle people visiting the URL without submitting an address
  if (!state?.voterInfo) {
    return <Navigate to="/" replace />;
  }

  return (
    <VotingInfoDisplay
      voterInfo={state.voterInfo} //contains CIVIC API response
      voterPosition={state.voterPosition} //lat and lng of voter's address
    />
  );
};
export default VotingInfoPage;
