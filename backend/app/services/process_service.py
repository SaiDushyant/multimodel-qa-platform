import os
import pickle

from app.utils.chunking import chunk_text
from app.services.embedding_service import get_embeddings
from app.services.faiss_service import create_faiss_index, save_metadata
from app.services.pdf_service import extract_text_from_pdf
from app.services.deepgram_service import transcribe_audio
from app.services.status_store import set_status

UPLOAD_DIR = "uploads"
INDEX_DIR = "faiss_indexes"


def process_file_logic(file_id: str, user_id: str):
    try:
        set_status(file_id, user_id, "processing")

        unique_id = f"{user_id}_{file_id}"

        # Find file
        files = os.listdir(UPLOAD_DIR)
        target_file = None

        for f in files:
            if f.startswith(unique_id):
                target_file = f
                break

        if not target_file:
            set_status(file_id, user_id, "failed")
            return {"error": "File not found or unauthorized"}

        file_path = os.path.join(UPLOAD_DIR, target_file)
        ext = target_file.split(".")[-1]

        words = None

        if ext == "pdf":
            text = extract_text_from_pdf(file_path)
        else:
            result = transcribe_audio(file_path)
            text = result["transcript"]
            words = result.get("words", [])

        chunks = chunk_text(text)

        if not chunks:
            set_status(file_id, user_id, "failed")
            return {"error": "No text extracted from file"}

        embeddings = get_embeddings(chunks)

        # ✅ FIXED HERE
        create_faiss_index(embeddings, unique_id)
        save_metadata(chunks, unique_id)

        if words:
            os.makedirs(INDEX_DIR, exist_ok=True)

            with open(f"{INDEX_DIR}/{unique_id}_words.pkl", "wb") as f:
                pickle.dump(words, f)

        set_status(file_id, user_id, "completed")

        return {
            "status": "processed",
            "chunks": len(chunks),
            "has_timestamps": words is not None,
        }

    except Exception as e:
        set_status(file_id, user_id, "failed")
        return {"status": "error", "message": str(e)}
