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

  //Validating user's address input
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
    <div>
      <h2>Voter Info</h2>
      {activePage == "addressEntryPage" ? (
        <>
          <h3>Enter your address to see your voting information</h3>
          <AddressForm
            validateAddressInput={validateAddressInput}
            getVoterInformationFromAddr={getVoterInformationFromAddr}
            validatedAddr={validatedAddr}
            setActivePage={setActivePage}
            validationAlertOpen={validationAlertOpen}
            setValidationAlertOpen={setValidationAlertOpen}
          />
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
  );
};

export default VoterInfo;
