from fastapi import APIRouter
from app.services.status_store import get_status

router = APIRouter()


@router.get("/{file_id}")
async def get_file_status(file_id: str):
    status = get_status(file_id)

    return {"file_id": file_id, "status": status}
