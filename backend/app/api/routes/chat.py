from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.services.rag_service import query_rag
from app.core.auth import get_current_user

router = APIRouter()


class ChatRequest(BaseModel):
    file_id: str
    query: str


@router.post("/")
async def chat(req: ChatRequest, user=Depends(get_current_user)):
    user_id = user["id"]

    result = query_rag(req.file_id, req.query, user_id)

    return result
