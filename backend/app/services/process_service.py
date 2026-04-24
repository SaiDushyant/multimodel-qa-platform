import os
import pickle
import logging

from app.utils.chunking import chunk_text
from app.services.embedding_service import get_embeddings
from app.services.faiss_service import create_faiss_index, save_metadata
from app.services.pdf_service import extract_text_from_pdf
from app.services.deepgram_service import transcribe_audio
from app.services.status_store import set_status

# ---------------- LOGGING ----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- PATHS ----------------
UPLOAD_DIR = "uploads"
INDEX_DIR = "faiss_indexes"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(INDEX_DIR, exist_ok=True)


def process_file_logic(file_id: str):
    try:
        logger.info(f"🚀 Starting processing for {file_id}")
        set_status(file_id, "processing")

        # ---------------- FIND FILE ----------------
        files = os.listdir(UPLOAD_DIR)
        target_file = None

        for f in files:
            if f.startswith(file_id):
                target_file = f
                break

        if not target_file:
            logger.error("❌ File not found")
            set_status(file_id, "failed")
            return {"error": "File not found"}

        file_path = os.path.join(UPLOAD_DIR, target_file)
        ext = target_file.split(".")[-1]

        logger.info(f"📄 File found: {file_path}")

        # ---------------- EXTRACT TEXT ----------------
        words = []

        if ext == "pdf":
            logger.info("📘 Extracting PDF text")
            text = extract_text_from_pdf(file_path)

        else:
            logger.info("🎙️ Transcribing audio/video")
            result = transcribe_audio(file_path) or {}

            text = result.get("transcript", "")
            words = result.get("words") or []

        if not text:
            logger.error("❌ Empty transcript/text")
            set_status(file_id, "failed")
            return {"error": "No text extracted from file"}

        # ---------------- CHUNKING ----------------
        logger.info("✂️ Chunking text")
        chunks = chunk_text(text)

        if not chunks:
            logger.error("❌ No chunks generated")
            set_status(file_id, "failed")
            return {"error": "No chunks generated"}

        # ---------------- EMBEDDINGS ----------------
        logger.info("🧠 Generating embeddings")
        embeddings = get_embeddings(chunks)

        if not embeddings:
            logger.error("❌ Embedding failure")
            set_status(file_id, "failed")
            return {"error": "Embedding generation failed"}

        # ---------------- FAISS INDEX ----------------
        logger.info("📦 Creating FAISS index")
        create_faiss_index(embeddings, file_id)
        save_metadata(chunks, file_id)

        # ---------------- SAVE TIMESTAMPS ----------------
        if words:
            logger.info("⏱️ Saving timestamps metadata")

            with open(f"{INDEX_DIR}/{file_id}_words.pkl", "wb") as f:
                pickle.dump(words, f)

        # ---------------- COMPLETE ----------------
        set_status(file_id, "completed")

        logger.info(f"✅ Processing completed for {file_id}")

        return {
            "status": "processed",
            "chunks": len(chunks),
            "has_timestamps": len(words) > 0,
        }

    except Exception as e:
        logger.exception(f"🔥 Processing failed for {file_id}: {str(e)}")
        set_status(file_id, "failed")

        return {
            "status": "error",
            "message": str(e),
        }
