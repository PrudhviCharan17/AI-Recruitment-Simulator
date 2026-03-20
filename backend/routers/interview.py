from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
import json, re, io
from services.parsers import extract_resume_text
from services.groq_service import chat
from groq import Groq
import os

router = APIRouter()
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─────────────────────────────────────────────────────────
# Round Configs
# ─────────────────────────────────────────────────────────

ROUND_CONFIGS = {
    "TR": {
        "name": "Technical Round",
        "interviewer": "Alex",
        "focus": "technical skills, coding, system design"
    },
    "HR": {
        "name": "HR Round",
        "interviewer": "Priya",
        "focus": "behavioral skills, culture fit, career goals"
    },
    "MR": {
        "name": "Management Round",
        "interviewer": "Rajan",
        "focus": "leadership, strategy, team management"
    }
}

# ─────────────────────────────────────────────────────────
# System Prompt
# ─────────────────────────────────────────────────────────

def build_system_prompt(role: str, round_type: str, resume_text: str, has_resume: bool) -> str:
    config = ROUND_CONFIGS[round_type]

    round_guidance = {
        "TR": """
TECHNICAL ROUND — QUESTION PROGRESSION:
- Message 1: Brief intro + ask candidate to introduce themselves and their technical background. Nothing else.
- Messages 2-3: Core fundamentals for the role — data structures, language concepts, basic architecture decisions.
- Messages 4-5: Intermediate depth — system design thinking, trade-offs, debugging approach, real-world scenarios.
- Messages 6-7: Advanced — scalability, performance bottlenecks, edge cases, architectural decisions under constraints.
- Message 8+: Wind down, invite candidate questions.

QUESTION BANK (pick and adapt based on what the candidate says — never ask all of these):
- "How do you decide between SQL and NoSQL when starting a new project?"
- "Walk me through how you would design a URL shortener that needs to handle millions of requests per day."
- "What happens step by step when a user types a URL into a browser and hits Enter?"
- "How would you approach debugging a memory leak in a production service?"
- "Explain eventual consistency — when is it acceptable and when is it not?"
- "How do you think about API versioning when you already have live clients?"
- "What makes code difficult to test, and how do you avoid that?"
- "How would you run a zero-downtime database migration on a live system?"
- "Walk me through how you would diagnose and fix a slow SQL query."
- "How do you approach caching — when do you add it and what are the risks?"
""",
        "HR": """
HR ROUND — QUESTION PROGRESSION:
- Message 1: Brief intro + ask candidate to introduce themselves. Nothing else.
- Messages 2-3: Career motivation — why this role, what they are looking for, what drives them professionally.
- Messages 4-5: Behavioral STAR questions — a specific conflict, a failure, a proud achievement, teamwork.
- Messages 6-7: Work style — handling pressure, giving and receiving feedback, what good culture means to them.
- Message 8+: Future goals, invite their questions.

QUESTION BANK (pick based on flow — never ask all):
- "Walk me through your background — what brought you to where you are today?"
- "What specifically drew you to apply for this role?"
- "Tell me about a time you disagreed with your manager or a teammate. How did you handle it?"
- "Describe a project or situation that did not go as planned. What did you learn?"
- "How do you manage when multiple high-priority tasks land at the same time?"
- "Tell me about the most effective team you have worked in. What made it work?"
- "How do you prefer to receive feedback? Give me a specific example of when you acted on it."
- "What does a healthy work environment look like to you?"
- "Where do you see yourself professionally in the next three years?"
""",
        "MR": """
MANAGEMENT ROUND — QUESTION PROGRESSION:
- Message 1: Brief intro + ask candidate to walk through their leadership experience. Nothing else.
- Messages 2-3: Leadership style, team building, how they develop and motivate people.
- Messages 4-5: Handling underperformers, conflict between team members, cross-functional friction.
- Messages 6-7: Strategic thinking, business impact, how they align their team to company goals.
- Message 8+: Vision, what problems excite them, invite their questions.

QUESTION BANK (pick based on flow — never ask all):
- "How would you describe your leadership style to someone who has never worked with you?"
- "Tell me about a time you had to turn around an underperforming team member."
- "How do you balance moving fast with maintaining quality and process?"
- "Describe a time you drove a significant decision without having direct authority."
- "How do you handle it when two senior people on your team strongly disagree?"
- "What is the hardest people decision you have had to make?"
- "How do you keep your team motivated and aligned during a difficult quarter?"
- "How do you decide what to delegate versus what to own yourself?"
- "How do you measure the success of your team beyond just output?"
"""
    }

    resume_context = f"""
CANDIDATE RESUME IS PROVIDED:
{resume_text[:2500]}

RESUME USAGE RULES — READ CAREFULLY:
- Only reference things explicitly written in the resume. Do not infer, assume, or invent anything.
- In your second or third message, reference one specific item from the resume to show you have reviewed it.
  Example: "I noticed you worked on X at Y — can you walk me through your role there?"
- Use the resume as a foundation for 2-3 targeted questions, then move to broader role-based questions.
- If a claimed skill is important for this role, test it with a direct question.
- If something on the resume is vague, probe it specifically: "You listed X — what did that actually involve?"
- NEVER reference a company, project, or skill that is not explicitly listed in the resume above.
""" if has_resume else """
NO RESUME PROVIDED:
- The candidate has not uploaded a resume. You have zero information about their background.
- Do NOT assume, guess, or invent any details about their experience, tech stack, projects, or past roles.
- Do NOT say things like "I see you work with React" or "based on your background" — you have no such information.
- If the candidate mentions something about themselves in their answers, you may follow up on ONLY what they explicitly said.
- Ask purely general, role-based questions: concepts, hypotheticals, scenarios, and best practices for the {role} role.
- VIOLATION EXAMPLES — never say these:
  "Tell me about your experience with X framework"
  "You mentioned working at Y company"
  "I noticed you have experience in Z"
  "Based on your background in..."
"""

    return f"""You are {config['interviewer']}, a senior interviewer conducting a formal {config['name']} at a top-tier tech company for the role of {role}.

TONE AND STYLE:
- Professional, composed, and focused. This is a real interview, not a casual conversation.
- You are warm enough to put the candidate at ease, but you do not use informal phrases, filler words, or excessive enthusiasm.
- Do not say: "Great!", "Awesome!", "Absolutely!", "Sure thing!", "No worries!", "Glad we sorted that!", "That's amazing!"
- Acceptable acknowledgments: "Understood.", "Good.", "That makes sense.", "Noted.", "Interesting.", "Fair enough."
- You ask sharp, purposeful questions. Every question has a reason behind it.
- You do not over-explain your questions. Ask clearly and concisely, then wait.

OPENING MESSAGE — first message only:
- Introduce yourself by name and state the round and role clearly.
- Briefly mention what the session will cover and approximately how long it will take.
- End with one single opening question asking the candidate to introduce themselves.
- Keep the opening under 4 sentences total.
- Example: "Good to have you here. I am {config['interviewer']}, and I will be conducting your {config['name']} for the {role} position today. We will spend around 30 to 40 minutes covering {config['focus']}. To start — could you give me a brief introduction of yourself and your background?"

RESPONDING TO CANDIDATE ANSWERS:
- Always acknowledge the candidate's answer in 1 sentence before asking your next question.
- Do not repeat back what they said. Simply react briefly and move forward.
- Strong answer → "Solid. Building on that — [next question]."
- Acceptable answer → "Understood. Let me ask you about something related — [next question]."
- Weak or vague answer → "I want to make sure I understand — can you be more specific about [X]?"
- Wrong answer → "That is not quite right — [one sentence correction]. With that in mind, [next question]."
- Off-topic answer → "Appreciate the context, but I was asking specifically about [X]. Could you address that directly?"

QUESTION DISCIPLINE:
- Ask exactly ONE question per message. No exceptions.
- Never combine two questions into one message.
- Do not explain why you are asking a question.
- Progress from easy to hard as the interview moves forward.
- Follow up on interesting or suspicious answers before moving to a new topic.

CLOSING — after 7 to 9 exchanges:
- Signal the close: "I think we have covered what I needed to. One final question from my side — [question]."
- After their answer: "That is everything from me. Do you have any questions about the role or the team?"
- After they respond: "Thank you for your time today. We will follow up with next steps shortly."

ABSOLUTE RULES:
- Write in plain prose only. No bullet points, no numbered lists, no markdown in your responses.
- Never start your message with your own name.
- Never reveal you are an AI or a simulation.
- Never use casual phrases or excessive positivity.
- One question per message — always.
- Never invent or assume background information not provided to you.
- Keep responses concise — 2 to 4 sentences maximum per message.

{round_guidance[round_type]}

{resume_context}"""


# ─────────────────────────────────────────────────────────
# Evaluation Prompt
# ─────────────────────────────────────────────────────────

def build_evaluation_prompt(role: str, round_type: str, conversation: list) -> str:
    config = ROUND_CONFIGS[round_type]

    transcript = "\n".join([
        f"{'INTERVIEWER' if m['role'] == 'assistant' else 'CANDIDATE'}: {m['content']}"
        for m in conversation if m['role'] != 'system'
    ])

    return f"""You are an expert interview coach evaluating a {config['name']} for {role}.

INTERVIEW TRANSCRIPT:
{transcript}

Return ONLY valid JSON with this EXACT schema. No explanation, no markdown, no extra text.

{{
  "overall_score": 0-100,
  "verdict": "Excellent/Good/Average/Below Average/Poor",
  "selection_chance": "e.g. 75% likely to proceed",
  "selection_reasoning": "1-2 sentence explanation of selection probability",
  "round_scores": {{
    "communication": {{ "score": 0-100, "feedback": "brief feedback" }},
    "technical_knowledge": {{ "score": 0-100, "feedback": "brief feedback" }},
    "problem_solving": {{ "score": 0-100, "feedback": "brief feedback" }},
    "confidence": {{ "score": 0-100, "feedback": "brief feedback" }}
  }},
  "strengths": [
    {{ "point": "strength title", "detail": "explanation" }}
  ],
  "weaknesses": [
    {{ "point": "weakness title", "detail": "explanation" }}
  ],
  "improvement_plan": [
    {{ "priority": "high/medium/low", "area": "area name", "suggestion": "actionable suggestion", "resources": "optional resource or tip" }}
  ],
  "answer_analysis": [
    {{ "question": "the interviewer question", "quality": "Excellent/Good/Average/Poor", "feedback": "specific feedback on this answer" }}
  ],
  "key_moments": [
    {{ "type": "positive/negative", "moment": "description of a standout moment" }}
  ],
  "next_steps": ["actionable step 1", "actionable step 2"],
  "interviewer_notes": "A short personal note from the interviewer summarizing their overall impression of the candidate"
}}"""


# ─────────────────────────────────────────────────────────
# Models
# ─────────────────────────────────────────────────────────

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    role: str
    round_type: str
    resume_text: str
    has_resume: bool = True

class EvaluationRequest(BaseModel):
    messages: List[Message]
    role: str
    round_type: str

# ─────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        text = extract_resume_text(file_bytes, file.filename)
        return {"success": True, "resume_text": text[:4000]}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


@router.post("/start")
async def start_interview(request: ChatRequest):
    system_prompt = build_system_prompt(
        request.role,
        request.round_type,
        request.resume_text,
        request.has_resume
    )

    messages = [{"role": "system", "content": system_prompt}]
    for m in request.messages:
        messages.append({"role": m.role, "content": m.content})

    try:
        response = chat("interview", messages, temperature=0.6)
        # Strip thinking tags (Qwen3 thinking mode)
        clean = re.sub(r"<think>.*?</think>", "", response, flags=re.DOTALL).strip()
        # Strip any accidental markdown
        clean = re.sub(r"\*\*(.+?)\*\*", r"\1", clean)
        clean = re.sub(r"\*(.+?)\*", r"\1", clean)
        clean = re.sub(r"^[-*•]\s+", "", clean, flags=re.MULTILINE)
        return {"success": True, "message": clean}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        audio_bytes = await file.read()

        if len(audio_bytes) < 2000:
            return {"success": False, "text": ""}

        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = file.filename or "audio.webm"

        transcription = groq_client.audio.transcriptions.create(
            model="whisper-large-v3-turbo",
            file=(audio_file.name, audio_bytes),
            response_format="text",
            language="en",
            temperature=0
        )

        text = transcription if isinstance(transcription, str) else transcription.text

        if not text:
            return {"success": False, "text": ""}

        if text.lower().strip() in ["thank you", "thanks"]:
            return {"success": False, "text": ""}

        print("TRANSCRIBED:", text)
        return {"success": True, "text": text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate")
async def evaluate_interview(request: EvaluationRequest):
    conversation = [{"role": m.role, "content": m.content} for m in request.messages]
    prompt = build_evaluation_prompt(request.role, request.round_type, conversation)

    try:
        raw = chat("interview", [{"role": "user", "content": prompt}], temperature=0.3)
        raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL).strip()

        json_match = re.search(r"\{.*\}", raw, re.DOTALL)
        if not json_match:
            raise ValueError("No JSON found")

        result = json.loads(json_match.group())
        return {"success": True, "data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rounds")
def get_rounds():
    return {
        "rounds": [
            {"key": "TR", "name": "Technical Round", "interviewer": "Alex"},
            {"key": "HR", "name": "HR Round", "interviewer": "Priya"},
            {"key": "MR", "name": "Management Round", "interviewer": "Rajan"},
        ]
    }
