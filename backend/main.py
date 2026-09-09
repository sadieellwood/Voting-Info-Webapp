import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("CIVIC_API_KEY")

url = "https://www.googleapis.com/civicinfo/v2/elections"

params = {
    "key": API_KEY
}

response = requests.get(url, params=params)

print(response.status_code)
print(response.json())