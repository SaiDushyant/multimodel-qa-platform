from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag_service import query_rag

router = APIRouter()


class ChatRequest(BaseModel):
    file_id: str
    query: str


@router.post("/")
async def chat(req: ChatRequest):
    result = query_rag(req.file_id, req.query)

    return result
