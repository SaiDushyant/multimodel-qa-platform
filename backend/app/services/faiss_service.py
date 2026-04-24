import faiss
import numpy as np
import os
import pickle

INDEX_DIR = "faiss_indexes"
os.makedirs(INDEX_DIR, exist_ok=True)


def create_faiss_index(embeddings, file_id):
    dim = len(embeddings[0])

    index = faiss.IndexFlatL2(dim)
    vectors = np.array(embeddings).astype("float32")

    index.add(vectors)

    faiss.write_index(index, f"{INDEX_DIR}/{file_id}.index")

    return index


def save_metadata(chunks, file_id):
    with open(f"{INDEX_DIR}/{file_id}.pkl", "wb") as f:
        pickle.dump(chunks, f)


def load_index(file_id):
    index = faiss.read_index(f"{INDEX_DIR}/{file_id}.index")

    with open(f"{INDEX_DIR}/{file_id}.pkl", "rb") as f:
        chunks = pickle.load(f)

    return index, chunks


def load_words(file_id):
    path = f"{INDEX_DIR}/{file_id}_words.pkl"

    if not os.path.exists(path):
        return None

    with open(path, "rb") as f:
        return pickle.load(f)
