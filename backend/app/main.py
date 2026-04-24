from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import upload, process, chat, status

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(process.router, prefix="/process", tags=["Process"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(status.router, prefix="/status", tags=["status"])


@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
