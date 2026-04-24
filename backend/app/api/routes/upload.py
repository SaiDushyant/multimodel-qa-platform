from fastapi import APIRouter, UploadFile, File, BackgroundTasks
import os
import uuid

from app.services.process_service import process_file_logic  # 👈 import this

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())

    # Get file extension
    ext = file.filename.split(".")[-1]
    filename = f"{file_id}.{ext}"

    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # 🔥 Trigger background processing
    background_tasks.add_task(process_file_logic, file_id)

    return {
        "file_id": file_id,
        "filename": filename,
        "file_type": ext,
        "status": "processing",
    }
