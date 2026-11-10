import VotingMap from "./Maps";
import { Navigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import PollContext from "./PollContext";
import { Tabs } from "@heroui/react";

const TabGroup = ({}) => {
  return (
    <Tabs className="w-full max-w-md" variant="secondary">
      <Tabs.ListContainer>
        <Tabs.List aria-label="tab options">
          <Tabs.Tab id="location">
            Location <Tabs.Indicator />
          </Tabs.Tab>

          <Tabs.Tab id="transit">
            Transit <Tabs.Indicator />
          </Tabs.Tab>

          <Tabs.Tab id="election">
            Election
            <Tabs.Indicator />
          </Tabs.Tab>

          <Tabs.Tab id="resources">
            Resources
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel className="pt-4" id="location">
        <LocationInfo />
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="transit">
        <TransitInfo />
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="election">
        <ElectionInfo />
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="resources">
        <Resources />
      </Tabs.Panel>
    </Tabs>
  );
};
const LocationInfo = ({}) => {
  const { selectedPoll } = useContext(PollContext);

  if (!selectedPoll) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <h2 className="mb-2 text-lg font-bold text-gray-800">
          Select a Location!
        </h2>
        <p className="text-sm text-gray-500">
          Click on a map marker to view polling location details.
        </p>
      </div>
    );
  }

  const address = selectedPoll.address;
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-5">
        <h2 className="text-xl leading-snug">{selectedPoll.name}</h2>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-800">
          {selectedPoll.type}
        </p>
      </div>
      <p>
        address: {address.street} {address.city}, {address.state} {address.zip}
      </p>
      <p>type: {selectedPoll.type}</p>
      <p>
        polling hours:
        {selectedPoll?.pollingHours || "unavailable"}
      </p>
      <p>voter services: {selectedPoll?.voterServices || "unavailable"}</p>
      <p>Start Date: {selectedPoll?.startDate || "unavailable"}</p>
      <p>End Date: {selectedPoll?.endDate || "unavailable"}</p>
    </div>
  );
};

const TransitInfo = ({}) => {
  return (
    <div className="flex h-full flex-col">
      <p>Transit info yeahhhhh</p>
    </div>
  );
};

const ElectionInfo = ({}) => {
  return (
    <div className="flex h-full flex-col">
      <p>Election Info</p>
    </div>
  );
};

const Resources = ({}) => {
  return <div className="flex h-full flex-col">Resources</div>;
};

const VotingInfoDisplay = ({ voterInfo, voterPosition }) => {
  console.log(voterInfo);
  const votingLocations = voterInfo.locations;
  console.log(votingLocations);

  const [selectedPoll, setSelectedPoll] = useState(null);

  return (
    <PollContext.Provider value={{ selectedPoll, setSelectedPoll }}>
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
          <div className="grid grid-cols-5 gap-5">
            <div className="col-span-3 border overflow-hidden rounded-2xl shadow-xl">
              <VotingMap
                votingLocations={votingLocations}
                addrPosition={voterPosition}
              ></VotingMap>
            </div>
            <div className="col-span-2 overflow-hidden rounded-2xl shadow-xl bg-white">
              <TabGroup />
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
