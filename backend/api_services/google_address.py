import os
import requests 
from dotenv import load_dotenv
from schemas import Address

load_dotenv()
API_KEY = os.getenv("CIVIC_API_KEY")
URL = "https://addressvalidation.googleapis.com/v1:validateAddress"


"""
Endpoint used for address validation, returns both printed address and geolocation
"""
def validate_address(address: dict):
    params ={
        "key": API_KEY
    }
    data = {
        "address": address,
    }

    response = requests.post(URL, params=params, json=data)

    #automatically raises exception for error response codes
    response.raise_for_status()
    
    response = response.json()
    # TODO: eventually this may need to occur in a separate function, also want to return recommended next steps
    address_info = {
        "formattedAddress": response["result"]["address"]["formattedAddress"],
        "position": {
            "lat": response['result']["geocode"]["location"]["latitude"],
            "lng": response['result']["geocode"]["location"]["longitude"],
        },
    }

    return address_info