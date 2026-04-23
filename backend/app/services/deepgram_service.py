import os
import requests
from app.config import DEEPGRAM_API_KEY


def transcribe_audio(file_path: str):
    url = "https://api.deepgram.com/v1/listen"

    headers = {"Authorization": f"Token {DEEPGRAM_API_KEY}", "Content-Type": "audio/*"}

    with open(file_path, "rb") as audio:
        response = requests.post(url, headers=headers, data=audio)

    result = response.json()

    words = result["results"]["channels"][0]["alternatives"][0]["words"]
    transcript = " ".join([w["word"] for w in words])

    return {"transcript": transcript, "words": words}
