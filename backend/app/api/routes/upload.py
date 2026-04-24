from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Depends
import os
import uuid

from app.services.process_service import process_file_logic
from app.core.auth import get_current_user

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    file_id = str(uuid.uuid4())
    user_id = user["id"]

    ext = file.filename.split(".")[-1]

    filename = f"{user_id}_{file_id}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # pass user_id too (important)
    background_tasks.add_task(process_file_logic, file_id, user_id)

    return {
        "file_id": file_id,
        "filename": filename,
        "file_type": ext,
        "status": "processing",
    }
