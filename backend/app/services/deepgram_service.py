import os
import requests
from backend.app.core.config import DEEPGRAM_API_KEY


def transcribe_audio(file_path: str):
    url = "https://api.deepgram.com/v1/listen"

    headers = {
        "Authorization": f"Token {DEEPGRAM_API_KEY}",
        "Content-Type": "audio/*",
    }

    with open(file_path, "rb") as audio:
        response = requests.post(url, headers=headers, data=audio)

    if response.status_code != 200:
        raise Exception(f"Deepgram API error: {response.text}")

    result = response.json()

    words = (
        result.get("results", {})
        .get("channels", [{}])[0]
        .get("alternatives", [{}])[0]
        .get("words", [])
    )

    transcript = " ".join([w.get("word", "") for w in words])

    return {"transcript": transcript, "words": words}
