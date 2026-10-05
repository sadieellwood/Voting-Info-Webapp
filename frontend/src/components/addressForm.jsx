"use client";
import React, { useState } from "react";
import { StateAbbreviations } from "./StateAbbreviations";
import { AlertDialog, Button, Input, Select } from "@heroui/react";

const AddressForm = ({
  validateAddressInput,
  getVoterInformationFromAddr,
  validatedAddr,
  setActivePage,
  validationAlertOpen,
  setValidationAlertOpen,
}) => {
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state, setState] = useState("");

  const handleSubmitForm = (event) => {
    event.preventDefault();
    const address = {
      address: {
        regionCode: "US",
        addressLines: [streetAddress, city + ", " + state + ", " + zipCode],
      },
    };
    validateAddressInput(address);
  };

  const handleAddressConfirmation = () => {
    getVoterInformationFromAddr(validatedAddr);
    setActivePage("votingInfomationPage");
  };

  // TODO: add an icon?
  function AddressValidationAlert() {
    console.log(validationAlertOpen);
    return (
      <>
        <AlertDialog.Backdrop
          isOpen={validationAlertOpen}
          onOpenChange={setValidationAlertOpen}
        >
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-[400px]">
              <AlertDialog.Header>
                <AlertDialog.Heading>
                  Does this address look right?
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>{validatedAddr}</p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" variant="tertiary">
                  Edit Address
                </Button>
                <Button
                  onPress={() => {
                    handleAddressConfirmation();
                    setValidationAlertOpen(false);
                  }}
                >
                  Confirm
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmitForm}>
        <Input
          type="text"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          placeholder="Street address"
        />
        <Input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {StateAbbreviations.map((stateAbbr) => (
            <option key={stateAbbr} value={stateAbbr}>
              {stateAbbr}
            </option>
          ))}
        </select>
        <Input
          type="text"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          placeholder="Zip Code"
        />
        <Button type="submit">Submit</Button>
      </form>
      <AddressValidationAlert />
    </>
  );
};

export default AddressForm;
