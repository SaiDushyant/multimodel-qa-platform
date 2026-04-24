import numpy as np
from app.services.faiss_service import load_index
from app.services.embedding_service import get_embeddings
from app.services.llm_service import call_groq_llm


def query_rag(file_id, query, top_k=5):
    index, chunks = load_index(file_id)

    query_embedding = np.array(get_embeddings([query])).astype("float32")

    distances, indices = index.search(query_embedding, top_k)

    retrieved_chunks = [chunks[i] for i in indices[0] if 0 <= i < len(chunks)]

    if not retrieved_chunks:
        return {"answer": "No relevant information found.", "sources": []}

    context = "\n\n".join(retrieved_chunks[:top_k])

    answer = call_groq_llm(context, query)

    return {"answer": answer, "sources": retrieved_chunks}
