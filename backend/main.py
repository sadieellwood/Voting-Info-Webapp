import os
import requests
from dotenv import load_dotenv
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List 

load_dotenv()
API_KEY = os.getenv("CIVIC_API_KEY")

app = FastAPI()

origins  = [
    "http://localhost:5173"
]

class AddressFormat(BaseModel):
    regionCode: str
    addressLines: List[str]

class Address(BaseModel):
    address: AddressFormat

class VoterInfoRequest(BaseModel):
    address: str
    electionId: int

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/info")
def getAddressInput(request: VoterInfoRequest):
    url = "https://www.googleapis.com/civicinfo/v2/voterinfo"
    params = {
        "key": API_KEY,
        "address": request.address,
        "electionId": request.electionId,
    }
    
    response = requests.get(url, params=params).json()
    # curate response
    print(response)
    print(response.get("pollingLocations"))
    #rint(response["pollingLocations"]["pollingHours"])
    return response

@app.post("/addressValidation")
def getValidAddress(request: Address):
    url = "https://addressvalidation.googleapis.com/v1:validateAddress"
    params = {
        "key": API_KEY,
    }

    data = {
        "address": request.address.model_dump(),
    }

    response = requests.post(url, params=params, json=data).json()


    return response['result']['address']['formattedAddress']


@app.get("/elections")
def getUpcomingElections():
    url = "https://www.googleapis.com/civicinfo/v2/elections"
    params = {
        "key": API_KEY,
    }
    response = requests.get(url, params=params).json()
    
    return response["elections"][1]["id"]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)