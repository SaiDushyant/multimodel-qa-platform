from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
import requests

from app.core.config import SUPABASE_URL, SUPABASE_ANON_KEY

security = HTTPBearer()


def get_current_user(token=Depends(security)):
    jwt = token.credentials

    res = requests.get(
        f"{SUPABASE_URL}/auth/v1/user",
        headers={
            "Authorization": f"Bearer {jwt}",
            "apikey": SUPABASE_ANON_KEY,
        },
    )

    if res.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")

    return res.json()
