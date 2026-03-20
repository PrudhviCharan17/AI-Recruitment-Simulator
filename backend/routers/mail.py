from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.groq_service import chat
import re

router = APIRouter()

class MailRequest(BaseModel):
    candidate_name: str
    candidate_email: str
    skills: str
    experience: str
    job_title: str
    employer_name: str
    job_city: str
    job_description: str

@router.post("/generate")
async def generate_mail(request: MailRequest):
    prompt = f"""Write a concise professional cold outreach email for a job application.

CANDIDATE:
Name: {request.candidate_name}
Email: {request.candidate_email}
Skills: {request.skills}
Experience: {request.experience}

JOB:
Title: {request.job_title}
Company: {request.employer_name}
Location: {request.job_city}
Description: {request.job_description[:600]}

RULES:
- First line: "Subject: <subject line>"
- Blank line after subject
- 3 short paragraphs, no bullet points
- Para 1: specific interest in this role and company
- Para 2: 2-3 matching skills from the job description
- Para 3: short call to action + thank you
- Sign off with candidate name only
- Under 180 words total
- Return ONLY the email, nothing else"""

    try:
        response = chat("mail", [{"role": "user", "content": prompt}], temperature=0.7)
        response = re.sub(r"<think>.*?</think>", "", response, flags=re.DOTALL).strip()
        return {"success": True, "mail": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))