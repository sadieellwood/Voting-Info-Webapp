import api from "../api.js";
import React, { useEffect, useState } from "react";
import AddressForm from "./addressForm.jsx";
import VotingInfoDisplay from "./votingInfoDisplay.jsx";

const VoterInfo = () => {
  const [voterInfo, setVoterInfo] = useState(null);
  const [validatedAddr, setValidatedAddr] = useState("");
  const [activePage, setActivePage] = useState("addressEntryPage");
  const [validationAlertOpen, setValidationAlertOpen] = useState(false);
  const [voterPosition, setVoterPosition] = useState(null);

  // Validating user's address input
  const validateAddressInput = async (address) => {
    console.log(address);
    try {
      const response = await api.post("/addressValidation", address);
      console.log(response.data);
      setValidatedAddr(response.data.formattedAddress);
      setVoterPosition(response.data.position);
      setValidationAlertOpen(true);
    } catch (error) {
      console.error("Error validating address:", error);
    }
  };

  const getVoterInformationFromAddr = async (address) => {
    try {
      //let's maybe try to do this in the backend
      const electionIds = await api.get("/elections");
      const response = await api.post("/polling", {
        address: address,
        electionId: electionIds.data[1].id,
      });
      setVoterInfo(response.data);
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  return (
    <div className="bg-blue-400 flex h-screen w-full items-center justify-center ">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex flex-row gap-5 bg-gray-50 px-8 py-6">
          <img
            src="src/components/images/marker.jpg"
            alt="map marker icon"
            className="size-12"
          />
          <h2 className="flex items-center text-3xl font-bold tracking-tight text-gray-900">
            Find Your Polling Location!
          </h2>
        </div>
        {activePage == "addressEntryPage" ? (
          <>
            <div className="bg-gray-50 px-8 py-8">
              <h3 className="text-xl font-semibold text-gray-800">
                Enter your address
              </h3>
              <AddressForm
                validateAddressInput={validateAddressInput}
                getVoterInformationFromAddr={getVoterInformationFromAddr}
                validatedAddr={validatedAddr}
                setActivePage={setActivePage}
                validationAlertOpen={validationAlertOpen}
                setValidationAlertOpen={setValidationAlertOpen}
              />
            </div>
          </>
        ) : (
          voterInfo && (
            <VotingInfoDisplay
              voterInfo={voterInfo}
              voterPosition={voterPosition}
            />
          )
        )}
      </div>
    </div>
  );
};

export default AddressPage;
