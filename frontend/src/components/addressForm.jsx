import React, { useState } from "react";
import { StateAbbreviations } from "./StateAbbreviations";

const AddressForm = ({ validateAddressInput, getVoterInformationFromAddr }) => {
  const [address, setAddress] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state, setState] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const address = {
        "address": {
          "regionCode": "US",
          "addressLines": [streetAddress, city + ", " + state + ", " + zipCode]
        }}
        validateAddressInput(address);
        setAddress("");
    };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={streetAddress}
        onChange={(e) => setStreetAddress(e.target.value)}
        placeholder="Street address"
      />
      <input 
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeHolder="City"
      />
      <select 
        value={state}
        onChange={(e) => setState(e.target.value)}
      >
        {StateAbbreviations.map(stateAbbr => (
            <option 
                key={stateAbbr} 
                value={stateAbbr}>{stateAbbr}</option>
        ))}
      </select>
      <input 
        type="text"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        placeHolder="Zip Code"
      />
      <button type="submit">Submit Address</button>
    </form>
  );
};

export default AddressForm;
