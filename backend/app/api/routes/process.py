from fastapi import APIRouter, Depends
from app.services.process_service import process_file_logic
from app.core.auth import get_current_user

router = APIRouter()


@router.post("/{file_id}")
async def process_file(file_id: str, user=Depends(get_current_user)):
    user_id = user["id"]

    return process_file_logic(file_id, user_id)
