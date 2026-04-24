from google import genai
from app.core.config import GEMINI_API_KEY

MODEL = "models/gemini-embedding-001"

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not set")

client = genai.Client(api_key=GEMINI_API_KEY)


def get_embeddings(texts: list[str]):
    # Clean input (same spirit as before but safer)
    texts = [t.strip() for t in texts if t and t.strip()]

    if not texts:
        return []

    try:
        response = client.models.embed_content(model=MODEL, contents=texts)

        # Keep SAME output format as old function
        return [e.values for e in response.embeddings]

    except Exception as e:
        raise Exception(f"Embedding failed: {str(e)}")
