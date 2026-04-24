import os

from app.utils.chunking import chunk_text
from app.services.embedding_service import get_embeddings
from app.services.faiss_service import create_faiss_index, save_metadata
from app.services.pdf_service import extract_text_from_pdf
from app.services.deepgram_service import transcribe_audio
from app.services.status_store import set_status

UPLOAD_DIR = "uploads"


def process_file_logic(file_id: str):
    try:
        set_status(file_id, "processing")

        # Find file
        files = os.listdir(UPLOAD_DIR)
        target_file = None

        for f in files:
            if f.startswith(file_id):
                target_file = f
                break

        if not target_file:
            set_status(file_id, "failed")
            return {"error": "File not found"}

        file_path = os.path.join(UPLOAD_DIR, target_file)
        ext = target_file.split(".")[-1]

        # Extract text
        if ext == "pdf":
            text = extract_text_from_pdf(file_path)
        else:
            result = transcribe_audio(file_path)
            text = result["transcript"]

        # Chunking
        chunks = chunk_text(text)

        if not chunks:
            set_status(file_id, "failed")
            return {"error": "No text extracted from file"}

        # Embeddings
        embeddings = get_embeddings(chunks)

        # Vector DB
        create_faiss_index(embeddings, file_id)
        save_metadata(chunks, file_id)

        set_status(file_id, "completed")

        return {"status": "processed", "chunks": len(chunks)}

    except Exception as e:
        set_status(file_id, "failed")

        return {"status": "error", "message": str(e)}
