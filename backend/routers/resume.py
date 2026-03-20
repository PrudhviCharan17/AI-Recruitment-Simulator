from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.parsers import extract_resume_text
from services.groq_service import chat
import json
import re

router = APIRouter()

RESUME_PROMPT = """You are an expert ATS (Applicant Tracking System) and professional resume analyst.

Analyze the following resume and return a detailed JSON response with this EXACT schema:

{{
  "candidate": {{
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string or null",
    "github": "string or null"
  }},
  "ats_score": {{
    "overall": 0-100,
    "breakdown": {{
      "formatting": 0-100,
      "keywords": 0-100,
      "experience": 0-100,
      "education": 0-100,
      "skills": 0-100
    }}
  }},
  "summary": "2-3 sentence professional summary of the candidate",
  "skills": {{
    "technical": ["list of technical skills"],
    "soft": ["list of soft skills"],
    "tools": ["list of tools/technologies"],
    "languages": ["programming languages if any"]
  }},
  "experience": [
    {{
      "company": "string",
      "role": "string",
      "duration": "string",
      "highlights": ["key achievements"],
      "impact_score": 0-10
    }}
  ],
  "education": [
    {{
      "institution": "string",
      "degree": "string",
      "year": "string",
      "gpa": "string or null"
    }}
  ],
  "strengths": ["list of 4-5 key strengths"],
  "weaknesses": ["list of 3-4 areas needing improvement"],
  "missing_sections": ["sections that should be added"],
  "keyword_gaps": ["important keywords missing for the target role — factor in job role if provided"],
  "improvement_suggestions": [
    {{
      "priority": "high/medium/low",
      "section": "string",
      "suggestion": "string — tailor to target job role if provided"
    }}
  ],
  "resume_based_roles": ["3-5 job titles that best match this candidate based ONLY on their resume skills, experience, and education. Do NOT factor in the target job role for this field."],
  "verdict": "Strong/Good/Average/Needs Work"
}}

STRICT RULES:
- "resume_based_roles" must be determined PURELY from resume content. Ignore any target job role entirely for this field.
- "improvement_suggestions" and "keyword_gaps" SHOULD be tailored to the target job role if one is provided.
- Return ONLY valid JSON. No explanation, no markdown, no extra text.

{job_context}

Resume:
{resume_text}"""


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_role: str = Form(default="")
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    allowed = ["pdf", "docx", "doc", "txt"]
    ext = file.filename.lower().split(".")[-1]
    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"File type .{ext} not supported. Use PDF, DOCX or TXT."
        )

    try:
        file_bytes = await file.read()
        resume_text = extract_resume_text(file_bytes, file.filename)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse file: {str(e)}")

    if len(resume_text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Resume appears to be empty or unreadable.")

    job_context = (
        f"Target job role provided by candidate: {job_role}. "
        f"Use this ONLY for keyword_gaps and improvement_suggestions. "
        f"Do NOT use it for resume_based_roles."
    ) if job_role else "No target job role provided."

    prompt = RESUME_PROMPT.format(
        resume_text=resume_text[:6000],
        job_context=job_context
    )

    try:
        raw = chat("resume", [{"role": "user", "content": prompt}], temperature=0.3)
        # Strip thinking tags if present (Qwen3 thinking mode)
        raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL).strip()
        # Extract JSON object from response
        json_match = re.search(r"\{.*\}", raw, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
        else:
            raise ValueError("No JSON found in response")
        return {"success": True, "data": result}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"AI returned invalid JSON: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
