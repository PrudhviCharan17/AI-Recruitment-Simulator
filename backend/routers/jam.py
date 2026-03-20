from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import json, re, io
from services.groq_service import chat
from groq import Groq
import os

router = APIRouter()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─────────────────────────────────────────────────────────
# Topics
# ─────────────────────────────────────────────────────────

JAM_TOPICS = [
    { "id": "system-design",    "label": "System Design",        "category": "Technical",    "prompt": "Explain how you would design a scalable system (e.g. URL shortener, chat app, or feed)" },
    { "id": "ds-algo",          "label": "DSA Concepts",          "category": "Technical",    "prompt": "Explain a data structure or algorithm of your choice — what it is, how it works, and when to use it" },
    { "id": "react-concepts",   "label": "React Concepts",        "category": "Technical",    "prompt": "Explain key React concepts like hooks, reconciliation, or state management" },
    { "id": "databases",        "label": "Databases",             "category": "Technical",    "prompt": "Talk about database design, indexing, normalization, or SQL vs NoSQL trade-offs" },
    { "id": "leadership",       "label": "Leadership Style",      "category": "Behavioral",   "prompt": "Describe your leadership philosophy and how you apply it in real situations" },
    { "id": "conflict",         "label": "Handling Conflict",     "category": "Behavioral",   "prompt": "Talk about how you handle conflict at work — give a real or hypothetical example" },
    { "id": "failure",          "label": "Learning from Failure", "category": "Behavioral",   "prompt": "Describe a professional failure and what you learned from it" },
    { "id": "career-goals",     "label": "Career Goals",          "category": "Behavioral",   "prompt": "Talk about your career goals and how your current path aligns with them" },
    { "id": "product-thinking", "label": "Product Thinking",      "category": "Product",      "prompt": "Walk through how you would approach building or improving a product feature" },
    { "id": "metrics",          "label": "Metrics & Impact",      "category": "Product",      "prompt": "Talk about how you define success, measure impact, and use data to make decisions" },
    { "id": "communication",    "label": "Communication Skills",  "category": "Soft Skills",  "prompt": "Talk about a time effective communication made a major difference in an outcome" },
    { "id": "custom",           "label": "Custom Topic",          "category": "Custom",       "prompt": "" },
]


# ─────────────────────────────────────────────────────────
# Evaluation Prompt
# ─────────────────────────────────────────────────────────

def build_eval_prompt(topic_label: str, topic_prompt: str, transcript: str) -> str:
    return f"""You are an expert communication and interview coach evaluating a 60-second spoken response.

TOPIC GIVEN TO THE SPEAKER: "{topic_label}"
TOPIC GUIDANCE: {topic_prompt}

WHAT THE SPEAKER SAID (transcribed from audio):
"{transcript}"

Evaluate this response thoroughly and return ONLY valid JSON with this exact schema:

{{
  "overall_score": 0-100,
  "verdict": "Excellent/Good/Average/Needs Work/Poor",
  "relevance_score": 0-100,
  "clarity_score": 0-100,
  "depth_score": 0-100,
  "confidence_score": 0-100,
  "relevance_feedback": "Was the response on-topic? What was covered well or missed?",
  "clarity_feedback": "How clear and structured was the delivery?",
  "depth_feedback": "Did they go deep enough? What was shallow or missing?",
  "confidence_feedback": "Did they sound confident and fluent or hesitant?",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "gaps": ["specific gap or missing point 1", "specific gap 2"],
  "improvement_tips": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
  "ideal_answer_outline": ["key point that should have been covered 1", "key point 2", "key point 3", "key point 4"],
  "summary": "2-3 sentence overall summary of how well they did and what to focus on next"
}}

Return ONLY valid JSON. No explanation, no markdown."""


# ─────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────

class EvalRequest(BaseModel):
    topic_id: str
    topic_label: str
    topic_prompt: str
    transcript: str


# ─────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────

@router.get("/topics")
def get_topics():
    return {"topics": JAM_TOPICS}


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()

        if len(audio_bytes) < 1000:
            return {"success": False, "text": "", "detail": "Recording too short"}

        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = file.filename or "audio.webm"

        transcription = groq_client.audio.transcriptions.create(
            model="whisper-large-v3-turbo",
            file=(audio_file.name, audio_bytes),
            response_format="text",
            temperature=0
        )

        text = transcription if isinstance(transcription, str) else transcription.text

        if not text or not text.strip():
            return {"success": False, "text": "", "detail": "No speech detected"}

        print("JAM TRANSCRIBED:", text)
        return {"success": True, "text": text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate")
async def evaluate_jam(request: EvalRequest):
    if not request.transcript or len(request.transcript.strip()) < 10:
        raise HTTPException(status_code=400, detail="Transcript is too short to evaluate")

    prompt = build_eval_prompt(request.topic_label, request.topic_prompt, request.transcript)

    try:
        raw = chat("interview", [{"role": "user", "content": prompt}], temperature=0.3)
        raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL).strip()

        json_match = re.search(r"\{.*\}", raw, re.DOTALL)
        if not json_match:
            raise ValueError("No JSON in response")

        result = json.loads(json_match.group())
        return {"success": True, "data": result}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"AI returned invalid JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
