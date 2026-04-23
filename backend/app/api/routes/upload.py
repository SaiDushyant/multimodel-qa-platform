from fastapi import APIRouter, UploadFile, File
import os
import uuid
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())

    # Get file extension
    ext = file.filename.split(".")[-1]
    filename = f"{file_id}.{ext}"

    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save file
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    return {"file_id": file_id, "filename": filename, "file_type": ext}
