import os
import requests 
from dotenv import load_dotenv
from schemas import VoterInfoRequest
from pathlib import Path
import json
from geopy.geocoders import Nominatim

load_dotenv()
API_KEY = os.getenv("CIVIC_API_KEY")
URL = "https://www.googleapis.com/civicinfo/v2/"
USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "false").lower() == "true"


"""
Endpoint function used for getting the election id, which is needed to request polling information
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
Endpoint function used for getting location-based polling info
"""
def get_polling_info(address: str, election_id: int, city: str):

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

        #format response so that it contains only the info necessary for the frontend
        response = format_voter_info(response.json())

        # switching to local data for vermont states in the case where no polling information is returned
        if len(response["locations"]) == 0 and "VT" in address:
            get_vt_polls(response, city)
            print(response)

    return response

"""
Endpoint for located polling places based on address
"""
def get_vt_polls(response, city):

    # pull info based on address's town
    polls = []
    with open("polling_data/vermont_polling.json", 'r') as f:
        data = json.load(f)
        polls = data[city]

        geolocator = Nominatim(user_agent="geolocator")

        #add location info to response
        for poll in polls:

            location = geolocator.geocode(poll.get("address") + " Vermont")

            if location:
                response['locations'].append({
                    "type": "Polling Station",
                    "name": poll.get('name'),
                    "address": poll.get('address'),
                    "lat": location.latitude,
                    "lng": location.longitude,
                    "pollingHours": None,
                    "startDate": None,
                    "endDate": None
                })

        #add warning for message about accuracy on the frontend
        response['warning'] = True

        
            
        
        
    
    

    # for each polling station, add to "locations" in the reponse dictionary

    # return the modified response dictionary
    return

"""
NOT AN ENDPOINT: function used to curate the data from polling info reponse for
easier use in the frontend
"""
def format_voter_info(data: dict):

    election_info = data.get("election", {})
    state_info = data.get("state", [{}])[0]

    election_admin = state_info.get("electionAdministrationBody", {})

    general_info = {
        "election" : {
            "name": election_info.get("name"),
            "date": election_info.get("electionDay")
        },
        "state" : {
            "electionInfoUrl": election_admin.get("electionInfoUrl"),
            "registrationUrl": election_admin.get("electionRegistrationUrl"),
            "absenteeVotingUrl": election_admin.get("absenteeVotingInfoUrl"),
            "votingLocationFinderUrl": election_admin.get("votingLocationFinderUrl")
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
        "locations": locations,
        "warning" : False
    }