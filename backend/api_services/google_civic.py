import os
import requests 
from dotenv import load_dotenv
from schemas import VoterInfoRequest
from pathlib import Path
import json

load_dotenv()
API_KEY = os.getenv("CIVIC_API_KEY")
URL = "https://www.googleapis.com/civicinfo/v2/"
USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "false").lower() == "true"


"""
Endpoint used for getting the election id, which is needed to request polling information
"""
def get_upcoming_elections():

    params = {
        "key": API_KEY,
    }
    response = requests.get(URL + "elections", params=params)
    #automatically raises exception for error response codes
    response.raise_for_status()

    data = response.json()
    #returns a list of eligible elections
    return data.get("elections", [])


"""
Endpoint used for getting location-based polling info
"""
def get_polling_info(address: str, election_id: int):

    # this is for testing with the fake polling data
    if USE_MOCK_DATA:
        MOCK_DATA_PATH = Path(__file__).resolve().parent.parent / "mock_data" / "fakeData.json"
        with open(MOCK_DATA_PATH, "r", encoding="utf-8") as f:
            response = json.load(f)

    else:

        params = {
            "key": API_KEY,
            "address": address,
            "electionId": election_id,
        }
        response = requests.get(URL + "voterinfo", params=params)
        response.raise_for_status() #automatically raises exception for error response codes
        response = response.json()

    print(format_voter_info(response))
    return format_voter_info(response)


"""
NOT AN ENDPOINT: function used to curate the data from polling info reponse for
easier use in the frontend
"""
def format_voter_info(data: dict):

    election_info = data.get("election", {})
    state_info = data.get("state", [{}])[0]

    general_info = {
        "election" : {
            "name": election_info.get("name"),
            "date": election_info.get("electionDay")
        },
        "state" : {
            "electionInfoUrl": state_info.get("electionInfoUrl"),
            "registrationUrl": state_info.get("electionRegistrationUrl"),
            "absenteeVotingUrl": state_info.get("absenteeVotingInfoUrl"),
            "votingLocationFinderUrl": state_info.get("votingLocationFinderUrl")
        }
    }

    # want markers for all polling sites (early voting, drop off, etc)
    locations = []

    for location in data.get("pollingLocations", []):
        address = location.get("address", {})

        locations.append({
            "type": "Polling Station",
            "name": address.get("locationName"),
            "address": {
                "street": address.get("line1"),
                "city": address.get("city"),
                "state": address.get("state"),
                "zip": address.get("zip")
            },
            "lat":location.get("latitude"),
            "lng": location.get("longitude"),
            "pollingHours": location.get("pollingHours"),
            "startDate": location.get("startDate"),
            "endDate": location.get("endDate")
        })

    for location in data.get("dropOffLocations", []):
        address = location.get("address", {})

        locations.append({
            "type": "Ballot Drop Off",
            "name": address.get("locationName"),
            "address": {
                "street": address.get("line1"),
                "city": address.get("city"),
                "state": address.get("state"),
                "zip": address.get("zip")
            },
            "lat":location.get("latitude"),
            "lng": location.get("longitude"),
            "pollingHours": location.get("pollingHours"),
            "startDate": location.get("startDate"),
            "endDate": location.get("endDate"),
            "voterServices": location.get("voterServices")
        })

    for location in data.get("earlyVoteSites", []):
        address = location.get("address", {})

        locations.append({
            "type": "Early Voting Site",
            "name": address.get("locationName"),
            "address": {
                "street": address.get("line1"),
                "city": address.get("city"),
                "state": address.get("state"),
                "zip": address.get("zip")
            },
            "lat":location.get("latitude"),
            "lng": location.get("longitude"),
            "pollingHours": location.get("pollingHours"),
            "startDate": location.get("startDate"),
            "endDate": location.get("endDate"),
            "voterServices": location.get("voterServices")
        })

    return {
        "generalInfo" : general_info,
        "locations": locations
    }