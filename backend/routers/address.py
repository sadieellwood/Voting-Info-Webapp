from fastapi import APIRouter
from schemas import Address
from api_services.google_address import validate_address

router = APIRouter(tags=["Address"])

@router.post("/addressValidation")
def get_valid_address(request: Address):
    address = request.address.model_dump()
    return validate_address(address)