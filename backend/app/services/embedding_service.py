from google import genai
from app.config import GEMINI_API_KEY

MODEL = "models/gemini-embedding-001"

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not set")

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_embeddings(chunks: list[str]):
    chunks = [c.strip() for c in chunks if c and c.strip()]

    if not chunks:
        return []

    try:
        response = client.models.embed_content(model=MODEL, contents=chunks)
        return [e.values for e in response.embeddings]
    except Exception as e:
        raise Exception(f"Embedding failed: {str(e)}")


def embed_query(query: str):
    query = query.strip()
    if not query:
        raise ValueError("Query cannot be empty")

    response = client.models.embed_content(model=MODEL, contents=query)

    if not response.embeddings:
        raise Exception("No embeddings returned from API")

    return response.embeddings[0].values
