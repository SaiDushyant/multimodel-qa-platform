from fastapi import APIRouter
from app.services.process_service import process_file_logic

router = APIRouter()


@router.post("/{file_id}")
async def process_file(file_id: str):
    return process_file_logic(file_id)
