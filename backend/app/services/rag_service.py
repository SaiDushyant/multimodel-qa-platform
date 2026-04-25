import numpy as np
import os
import pickle

from app.services.faiss_service import load_index
from app.services.embedding_service import get_embeddings
from app.services.llm_service import call_groq_llm


INDEX_DIR = "faiss_indexes"


def load_words_if_available(file_id):
    path = f"{INDEX_DIR}/{file_id}_words.pkl"

    if not os.path.exists(path):
        return None

    with open(path, "rb") as f:
        return pickle.load(f)


def get_timestamp_for_chunk(chunk, words):
    if not words:
        return None

    chunk_words = [w.lower() for w in chunk.split()[:5]]

    for w in words:
        word_text = w.get("word", "").lower()

        if word_text in chunk_words:
            return w.get("start", 0)

    return None


def query_rag(file_id, query, user_id, top_k=5):
    unique_id = f"{user_id}_{file_id}"

    index, chunks = load_index(unique_id)

    query_embedding = np.array(get_embeddings([query])).astype("float32")

    distances, indices = index.search(query_embedding, top_k)

    retrieved_chunks = [chunks[i] for i in indices[0] if 0 <= i < len(chunks)]

    if not retrieved_chunks:
        return {
            "answer": "No relevant information found.",
            "sources": [],
            "timestamps": [],
        }

    words = load_words_if_available(unique_id)

    timestamps = [get_timestamp_for_chunk(chunk, words) for chunk in retrieved_chunks]

    context = "\n\n".join(retrieved_chunks[:top_k])

    answer = call_groq_llm(context, query)
    answer = answer.replace("undefined", "").strip()

    return {
        "answer": answer,
        "sources": retrieved_chunks,
        "timestamps": timestamps,
    }
