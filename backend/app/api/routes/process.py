from fastapi import APIRouter
import os

from app.services.pdf_service import extract_text_from_pdf
from app.services.deepgram_service import transcribe_audio

router = APIRouter()

UPLOAD_DIR = "uploads"


@router.post("/{file_id}")
async def process_file(file_id: str):
    # Find file
    files = os.listdir(UPLOAD_DIR)
    target_file = None

    for f in files:
        if f.startswith(file_id):
            target_file = f
            break

    if not target_file:
        return {"error": "File not found"}

    file_path = os.path.join(UPLOAD_DIR, target_file)
    ext = target_file.split(".")[-1]

    # PDF
    if ext == "pdf":
        text = extract_text_from_pdf(file_path)

        return {"type": "pdf", "text_length": len(text)}

    # Audio/Video
    else:
        result = transcribe_audio(file_path)

        return {
            "type": "media",
            "transcript_length": len(result["transcript"]),
            "sample_words": result["words"][:5],
        }
