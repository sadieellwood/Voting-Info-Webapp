import os
import requests 
from dotenv import load_dotenv
from schemas import VoterInfoRequest

load_dotenv()
API_KEY = os.getenv("CIVIC_API_KEY")
URL = "https://www.googleapis.com/civicinfo/v2/"


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
    params = {
        "key": API_KEY,
        "address": address,
        "electionId": election_id,
    }
    response = requests.get(URL + "voterinfo", params=params)

    #automatically raises exception for error response codes
    response.raise_for_status()
    return response.json()