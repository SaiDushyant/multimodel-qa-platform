from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import upload, process, chat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(process.router, prefix="/process", tags=["Process"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])


@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
