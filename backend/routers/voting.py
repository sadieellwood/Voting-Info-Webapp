from fastapi import APIRouter
from schemas import VoterInfoRequest
from api_services.google_civic import (
    get_polling_info,
    get_upcoming_elections
) 

router = APIRouter(tags=["Voting"])

@router.post("/polling")
def get_voter_info(request: VoterInfoRequest):
    return get_polling_info(
        address=request.address,
        election_id=request.electionId
    )

@router.get("/elections")
def get_elections():
    return get_upcoming_elections()