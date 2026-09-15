import os
import shutil
import tempfile
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.whisper_service import whisper_service
from services.llm_service import llm_service
from services.rag_service import rag_service
from services.skill_gap_service import skill_gap_service

app = FastAPI(
    title="JeevanVani AI Microservice",
    description="Python AI Service for Whisper ASR, LLM Conversational Profiling, and NSQF/PM-AJAY RAG",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class ExtractProfileRequest(BaseModel):
    text: str
    language: Optional[str] = "hi"
    current_profile: Optional[Dict[str, Any]] = None

class RAGQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3

class RAGExplainRequest(BaseModel):
    target_title: str
    user_profile: Optional[Dict[str, Any]] = {}

class SkillGapRequest(BaseModel):
    user_skills: List[str]
    target_role_name: str
    work_experience: Optional[str] = ""

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JeevanVani Python AI Microservice",
        "version": "2.0.0",
        "modules": {
            "whisper_asr": "active",
            "llm_profiling": "active",
            "rag_knowledge": "active",
            "skill_gap_engine": "active"
        }
    }

@app.post("/api/v1/whisper/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form("hi")
):
    """
    Transcribes incoming audio file (WebM / WAV / MP3) into text using Whisper ASR.
    """
    try:
        suffix = os.path.splitext(file.filename)[1] or ".webm"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        try:
            result = whisper_service.transcribe(tmp_path, language=language)
            return {
                "success": True,
                "data": result
            }
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio transcription failed: {str(e)}")

@app.post("/api/v1/llm/extract-profile")
def extract_profile(payload: ExtractProfileRequest):
    """
    Extracts structured beneficiary profile entities from conversational text.
    """
    try:
        result = llm_service.extract_profile_entities(
            text=payload.text,
            current_profile=payload.current_profile,
            language=payload.language or "hi"
        )
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Entity extraction failed: {str(e)}")

@app.post("/api/v1/rag/query")
def query_rag(payload: RAGQueryRequest):
    """
    Retrieves grounded knowledge documents for NSQF, RPL, and PM-AJAY.
    """
    try:
        docs = rag_service.retrieve(query=payload.query, top_k=payload.top_k or 3)
        return {
            "success": True,
            "data": {
                "query": payload.query,
                "retrievedCount": len(docs),
                "documents": docs
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")

@app.post("/api/v1/rag/explain")
def explain_recommendation(payload: RAGExplainRequest):
    """
    Generates explainable rationale with anti-hallucination citations.
    """
    try:
        explanation = rag_service.explain(
            target_title=payload.target_title,
            user_profile=payload.user_profile or {}
        )
        return {
            "success": True,
            "data": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG explain failed: {str(e)}")

@app.post("/api/v1/ai/skill-gap")
def compute_skill_gap(payload: SkillGapRequest):
    """
    Computes exact skill gap delta and RPL eligibility.
    """
    try:
        gap_analysis = skill_gap_service.compute_skill_gap(
            user_skills=payload.user_skills,
            target_role_name=payload.target_role_name,
            work_experience=payload.work_experience or ""
        )
        return {
            "success": True,
            "data": gap_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill gap analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
