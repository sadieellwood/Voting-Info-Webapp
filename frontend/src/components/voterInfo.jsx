import api from "../api.js";
import React, { useEffect, useState } from 'react';
import AddressForm from "./addressForm.jsx";

const testAddr = {
  "address": {
    "regionCode": "US",
    "addressLines": ["1600 Amphitheatre Pkwy", "Mountain View, CA, 94043"]
  },
};

const VoterInfo = () => {
    const [voterInfo, setVoterInfo] = useState("");
    const [validatedAddr, setValidatedAddr] = useState("")

    const validateAddressInput = async (address) => {
      console.log(address)
      try {
        const response = await api.post('/addressValidation', address)
        setValidatedAddr(response.data)
        await getVoterInformationFromAddr(response.data)
      } catch (error) {
        console.error("Error validating address:", error)
      }

      
    };

    const getVoterInformationFromAddr = async (address) => {
        try {
          const electionId = await api.get("/elections")
          console.log(electionId.data)
          console.log(`voterInfo address: ${address}`)
          const response = await api.post('/info', {address: address, electionId: electionId.data});
          setVoterInfo(JSON.stringify(response.data))
          //fetchFruits();  // Refresh the list after adding a fruit
        } catch (error) {
          console.error("Error getting address:", error);
        }
      };

    return (
    <div>
        <h2>Voter Info</h2>
        <pre>{voterInfo ? `Voting info for ${validatedAddr}: ${voterInfo}` : "Type in your address to see your voter information."}</pre>
        <AddressForm validateAddressInput = {validateAddressInput} getVoterInformationFromAddr = {getVoterInformationFromAddr}/>

    </div>
    
    );
};

export default VoterInfo;

