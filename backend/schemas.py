from pydantic import BaseModel
from typing import List

"""
Schemas needed for fetching data from the frontend
"""

class AddressFormat(BaseModel):
    regionCode: str
    addressLines: List[str]
    
    
class Address(BaseModel):
    address: AddressFormat


class VoterInfoRequest(BaseModel):
    address: str
    electionId: int