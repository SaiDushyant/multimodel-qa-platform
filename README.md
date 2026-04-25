# 🧠 AI-Powered Multimodal RAG System with Timestamp-Aware Retrieval

An end-to-end AI application that allows users to upload PDFs, audio, and video files, interact with them via a chatbot, and jump directly to relevant moments using timestamp-aware retrieval.

---

## 🚀 Live Demo

> https://multimodel-qa-platform.vercel.app/

---

## 📌 Features

### 🔐 Authentication

* User authentication powered by Supabase
* Secure JWT-based API access
* User-specific file isolation

### 📂 File Handling

* Upload support for:

  * PDFs
  * Audio files (MP3)
  * Video files (MP4)
* Drag-and-drop UI with modern UX
* File processing status tracking

### 🧠 AI-Powered RAG

* Document chunking and embedding
* FAISS-based vector similarity search
* Context-aware question answering

### 💬 Chat Experience

* ChatGPT-like interface
* Enter-to-send interaction
* Streaming-like response rendering (simulated typing)
* Conversation history

### ⏱️ Timestamp Retrieval (Key Feature)

* Extract timestamps using Deepgram
* Map answers to relevant audio/video segments
* Click-to-seek playback

### 🎥 Media Playback

* Integrated video/audio player
* Jump to exact relevant timestamps
* Seamless AI + media interaction

---

## 🏗️ Architecture

```
Frontend (React + Vite + Tailwind)
        ↓
FastAPI Backend
        ↓
-----------------------------------
| Supabase (Auth + Metadata)      |
-----------------------------------
        ↓
Processing Pipeline:
  PDF → pdfplumber → text
  Audio/Video → Deepgram → transcript + timestamps
        ↓
Chunking → Embeddings (Gemini)
        ↓
FAISS Vector Index (local storage)
        ↓
Query → Retrieval → Groq LLM → Response
        ↓
Frontend → Chat + Media Player
```

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Supabase JS Client

### Backend

* FastAPI
* LangChain (RAG pipeline)
* FAISS (vector database)

### AI & APIs

* Groq (LLM inference - LLaMA 3)
* Google Gemini (embeddings)
* Deepgram (speech-to-text + timestamps)

### Storage & Auth

* Supabase (PostgreSQL + Auth)
* Local storage for FAISS index

### DevOps

* Docker
* Render (backend deployment)
* Vercel (frontend deployment)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/SaiDushyant/multimodel-qa-platform.git
cd multimodel-qa-platform
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or Windows equivalent

pip install -r requirements.txt
```

Create `.env`:

```env
GROQ_API_KEY=your_key
DEEPGRAM_API_KEY=your_key
GEMINI_API_KEY=your_key
SUPABASE_URL=your_url
```

Run:

```bash
uvicorn app.main:app --reload
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_BACKEND_BASE_URL=http://127.0.0.1:8000
```

Run:

```bash
npm run dev
```

---

## 🧪 Testing

* Unit tests using `pytest`
* Mock external APIs for reliability
* Coverage tracking using `coverage.py`

*(Add test commands once implemented)*

---

## 📦 Deployment

### Backend (Render)

* Dockerized FastAPI app
* Environment variables configured in dashboard

### Frontend (Vercel)

* Auto-deploy from GitHub
* Environment variables configured

---

## ⚠️ Known Limitations

* FAISS index stored locally (lost on server restart)
* Streaming is simulated (not true token streaming)
* Large files may hit API limits

---

## 🔮 Future Improvements

* True streaming (SSE/WebSockets)
* Multi-file knowledge base
* Supabase storage for FAISS persistence
* Advanced semantic timestamp alignment
* File management (rename/delete)
* Real-time collaboration

---

## 📸 Demo Walkthrough

1. Upload a file (PDF/audio/video)
2. Wait for processing
3. Ask a question
4. View AI-generated answer
5. Click timestamp → jump to relevant media segment

---

## ⭐ Acknowledgements

* Groq for ultra-fast LLM inference
* Deepgram for accurate transcription
* Supabase for backend infrastructure
* LangChain for RAG framework

---

## 💡 Final Note

This project demonstrates:

* End-to-end system design
* AI integration in real-world applications
* Full-stack engineering with production mindset

---
