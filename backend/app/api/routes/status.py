from fastapi import APIRouter, Depends
from app.services.status_store import get_status
from app.core.auth import get_current_user

router = APIRouter()


@router.get("/{file_id}")
async def get_file_status(file_id: str, user=Depends(get_current_user)):
    user_id = user["id"]

    status = get_status(file_id, user_id)

    return {"file_id": file_id, "status": status}
