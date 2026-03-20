from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json, re
from services.groq_service import chat

router = APIRouter()

# ─── AI Participants ───────────────────────────────────────────────────
PARTICIPANTS = {
    "Arjun": {
        "avatar": "A",
        "color": "#3b82f6",
        "personality": "Analytical and data-driven. Backs every point with logic and examples. Occasionally interrupts when he strongly disagrees. Speaks confidently but respectfully.",
        "style": "structured, uses phrases like 'According to recent data...', 'Statistically speaking...', 'Let me build on that point...'"
    },
    "Priya": {
        "avatar": "P",
        "color": "#10b981",
        "personality": "Creative thinker and devil's advocate. Often presents the opposing viewpoint. Keeps the discussion balanced. Occasionally challenges others politely.",
        "style": "engaging, uses phrases like 'On the other hand...', 'Have we considered...', 'That's a valid point, but...'"
    },
    "Rohan": {
        "avatar": "R",
        "color": "#f59e0b",
        "personality": "Practical and solution-oriented. Focuses on real-world applications and implementation. Tries to summarize and conclude when discussion gets scattered.",
        "style": "concise, uses phrases like 'Practically speaking...', 'To bring this to a conclusion...', 'The real challenge here is...'"
    }
}

GD_TOPICS = {
    "Technology & AI": [
        "Is Artificial Intelligence a threat or opportunity for employment?",
        "Should social media platforms be regulated by governments?",
        "Is remote work the future of corporate culture?",
        "Should AI-generated content be labeled mandatorily?",
        "Is data privacy a myth in the digital age?",
    ],
    "Society & Ethics": [
        "Should college education be free for everyone?",
        "Is social media doing more harm than good to society?",
        "Should the voting age be lowered to 16?",
        "Is cancel culture helpful or harmful to society?",
        "Should euthanasia be legalized?",
    ],
    "Business & Economy": [
        "Is startup culture overrated in India?",
        "Should there be a limit on CEO salaries?",
        "Is cryptocurrency the future of money?",
        "Should gig economy workers get full employment benefits?",
        "Is globalization doing more harm than good?",
    ],
    "Environment": [
        "Should plastic be completely banned?",
        "Is nuclear energy the solution to climate change?",
        "Should individuals be taxed based on their carbon footprint?",
        "Is electric vehicle adoption realistic for developing countries?",
    ],
    "Current Affairs": [
        "Is India ready to become a developed nation by 2047?",
        "Should brain drain be a concern for developing nations?",
        "Is STEM education being overemphasized at the cost of arts?",
        "Should military service be mandatory for youth?",
    ]
}

# ─── Prompts ──────────────────────────────────────────────────────────
def build_moderator_prompt(topic: str) -> str:
    return f"""You are a professional GD (Group Discussion) moderator/conductor for a corporate selection process.

Your job is to START the group discussion formally and naturally.

Topic: "{topic}"

Write a brief, professional opening statement (3-4 sentences) that:
1. Welcomes the participants
2. Introduces the topic clearly
3. States the rules briefly (everyone will get turns, be respectful)
4. Invites the first participant to begin

Speak naturally as a real moderator. Do NOT use bullet points. Write in flowing sentences."""

def build_participant_prompt(name: str, topic: str, transcript: list, instruction: str) -> str:
    p = PARTICIPANTS[name]
    history = "\n".join([
        f"{m['speaker']}: {m['content']}" for m in transcript[-12:]
    ])
    
    return f"""You are {name}, a participant in a Group Discussion.

Topic: "{topic}"

Your personality: {p['personality']}
Your speaking style: {p['style']}

DISCUSSION SO FAR:
{history if history else "Discussion just started."}

INSTRUCTION: {instruction}

RULES:
1. Speak as {name} — stay in character completely
2. Keep your response to 3-5 sentences maximum — GD responses should be concise
3. Make ONE clear point or argument
4. Reference what others said if relevant — show you're listening
5. NEVER use bullet points or numbered lists — speak naturally
6. NEVER break character or mention you are an AI
7. Strip any internal thinking — speak directly

Respond as {name} would speak in a real GD."""

def build_evaluation_prompt(topic: str, transcript: list, user_name: str) -> str:
    full_transcript = "\n".join([
        f"{m['speaker']}: {m['content']}" for m in transcript
    ])
    user_turns = [m for m in transcript if m['speaker'] == user_name]
    user_passes = sum(1 for m in transcript if m.get('is_pass') and m['speaker'] == user_name)
    
    return f"""You are an expert GD (Group Discussion) evaluator for corporate/campus placements.

GD TOPIC: "{topic}"
CANDIDATE NAME: {user_name}
TOTAL USER CONTRIBUTIONS: {len(user_turns)}
TIMES USER PASSED: {user_passes}

FULL TRANSCRIPT:
{full_transcript}

Evaluate the candidate's GD performance and return a detailed JSON with this EXACT schema:
{{
  "overall_score": 0-100,
  "verdict": "Outstanding/Good/Average/Below Average/Poor",
  "gd_pass_chance": "Very High (85-100%)/High (70-85%)/Medium (50-70%)/Low (25-50%)/Very Low (<25%)",
  "pass_reasoning": "2-3 sentences explaining their GD pass chance based on actual performance",
  "category_scores": {{
    "communication": {{"score": 0-100, "feedback": "specific feedback"}},
    "content_quality": {{"score": 0-100, "feedback": "specific feedback"}},
    "leadership": {{"score": 0-100, "feedback": "specific feedback"}},
    "listening_skills": {{"score": 0-100, "feedback": "specific feedback"}},
    "confidence": {{"score": 0-100, "feedback": "specific feedback"}},
    "relevance": {{"score": 0-100, "feedback": "specific feedback"}}
  }},
  "participation_stats": {{
    "total_contributions": {len(user_turns)},
    "passes_taken": {user_passes},
    "participation_rate": "percentage of overall discussion",
    "avg_response_quality": "Excellent/Good/Average/Poor"
  }},
  "strengths": [
    {{"point": "strength title", "detail": "specific example from GD transcript"}}
  ],
  "weaknesses": [
    {{"point": "weakness title", "detail": "specific example and improvement advice"}}
  ],
  "best_contribution": "quote or describe their single best point in the GD",
  "missed_opportunities": ["points they could have made but didn't", "moments they should have spoken but passed"],
  "contribution_analysis": [
    {{
      "what_was_said": "brief summary of what user said",
      "quality": "Excellent/Good/Average/Poor",
      "impact": "how it affected the discussion",
      "feedback": "specific improvement tip"
    }}
  ],
  "improvement_plan": [
    {{
      "priority": "high/medium/low",
      "area": "area name",
      "suggestion": "specific actionable tip",
      "practice": "how to practice this"
    }}
  ],
  "compared_to_peers": {{
    "vs_arjun": "how user compared to Arjun",
    "vs_priya": "how user compared to Priya",
    "vs_rohan": "how user compared to Rohan"
  }},
  "evaluator_summary": "2-3 sentences as a real GD evaluator summarizing this candidate"
}}

Be honest and specific. Reference actual things the candidate said. Return ONLY valid JSON."""

# ─── Models ───────────────────────────────────────────────────────────
class TranscriptEntry(BaseModel):
    speaker: str
    content: str
    is_pass: Optional[bool] = False

class ModeratorRequest(BaseModel):
    topic: str

class ParticipantRequest(BaseModel):
    name: str
    topic: str
    transcript: List[TranscriptEntry]
    instruction: str = "Continue the discussion — make a relevant point or counter-argument"

class EvaluationRequest(BaseModel):
    topic: str
    transcript: List[TranscriptEntry]
    user_name: str

# ─── Endpoints ────────────────────────────────────────────────────────
@router.get("/topics")
def get_topics():
    return {"topics": GD_TOPICS, "participants": PARTICIPANTS}

@router.post("/moderate/open")
async def open_discussion(request: ModeratorRequest):
    """Get moderator's opening statement"""
    prompt = build_moderator_prompt(request.topic)
    try:
        response = chat("gd", [{"role": "user", "content": prompt}], temperature=0.7)
        response = re.sub(r"<think>.*?</think>", "", response, flags=re.DOTALL).strip()
        return {"success": True, "message": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/participant/speak")
async def participant_speak(request: ParticipantRequest):
    """Get a specific AI participant's response"""
    transcript = [{"speaker": m.speaker, "content": m.content} for m in request.transcript]
    prompt = build_participant_prompt(
        request.name, request.topic, transcript, request.instruction
    )
    try:
        response = chat("gd", [{"role": "user", "content": prompt}], temperature=0.85)
        response = re.sub(r"<think>.*?</think>", "", response, flags=re.DOTALL).strip()
        return {"success": True, "speaker": request.name, "message": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate")
async def evaluate_gd(request: EvaluationRequest):
    """Generate comprehensive GD evaluation"""
    transcript = [{"speaker": m.speaker, "content": m.content, "is_pass": m.is_pass} for m in request.transcript]
    prompt = build_evaluation_prompt(request.topic, transcript, request.user_name)
    try:
        raw = chat("gd", [{"role": "user", "content": prompt}], temperature=0.3)
        raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL).strip()
        json_match = re.search(r"\{.*\}", raw, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
        else:
            raise ValueError("No JSON in response")
        return {"success": True, "data": result}
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Evaluation parsing failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
