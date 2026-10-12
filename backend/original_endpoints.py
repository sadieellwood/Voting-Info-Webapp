
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
    # rint(response["pollingLocations"]["pollingHours"])
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

    #automatically raises exception for error response codes
    response.raise_for_status()
    print(f"RESPONSE: response")
    data = {
        "formattedAddress": response["result"]["address"]["formattedAddress"],
        "position": {
            "lat": response['result']["geocode"]["location"]["latitude"],
            "lng": response['result']["geocode"]["location"]["longitude"],
        },
    }
    return data


@app.get("/elections")
def getUpcomingElections():
    url = "https://www.googleapis.com/civicinfo/v2/elections"
    params = {
        "key": API_KEY,
    }
    response = requests.get(url, params=params).json()

    return response["elections"][1]["id"]
