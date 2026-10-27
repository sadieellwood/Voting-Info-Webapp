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
      <form onSubmit={handleSubmitForm} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {/* street address */}
          <label
            htmlFor="streetAddress"
            className="text-sm font-medium text-gray-700"
          >
            Street Address
          </label>
          <Input
            id="streetAddress"
            type="text"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="123 Main Street"
            isrequired
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-5 gap-5 sm:grid-cols-2">
          <div className="col-span-2 flex flex-col gap-2">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">
              City
            </label>
            <Input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Your City"
              isrequired
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="state"
              className="text-sm font-medium text-gray-700"
            >
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="" disabled>
                Select state
              </option>
              {StateAbbreviations.map((stateAbbr) => (
                <option key={stateAbbr} value={stateAbbr}>
                  {stateAbbr}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="state"
              className="text-sm font-medium text-gray-700"
            >
              State
            </label>
            <Input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="ZIP Code"
              isrequired
            />
          </div>
        </div>
        <div className="flex justify-end border-t border-gray-200 pt-5">
          <Button
            type="submit"
            className="min-w-32 bg-blue-600 px-6 font-semibold text-gray-50 transition hover:bg-blue-700 rounded-m border"
          >
            Get My Voting Info
          </Button>
        </div>
      </form>
      <AddressValidationAlert />
    </>
  );
};

export default AddressForm;
