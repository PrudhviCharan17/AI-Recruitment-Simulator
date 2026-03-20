# AI Recruitment Simulator

A free, full-stack AI-powered recruitment preparation platform. Practice resume analysis, mock interviews, group discussions, and JAM sessions — no account required.

---

## Features

**Resume Analyzer**
Upload your resume (PDF, DOCX, or TXT) and get an ATS compatibility score with a detailed breakdown across formatting, keywords, experience, education, and skills. The analyzer extracts your technical skills, tools, and languages, identifies gaps, and suggests improvements by priority. Enter an optional target job role to get tailored keyword suggestions and live job listings ranked by how well they match your resume. Each job listing includes a one-click AI email draft generated from your resume.

**Interview Simulator**
Practice three interview rounds — Technical (Alex), HR (Priya), and Management (Rajan) — with an AI interviewer that conducts a structured, professional session. Upload your resume and the interviewer asks questions grounded in your actual experience. Without a resume, it asks general role-based questions. Supports text and voice input. At the end, you receive a full evaluation report with scores, answer analysis, strengths, weaknesses, and an improvement plan.

**Group Discussion Simulator**
Simulate a real group discussion with three AI participants — Arjun (analytical thinker), Priya (devil's advocate), and Rohan (practical thinker). Choose a topic from five categories or enter your own. A moderator opens the session formally. You can speak or pass each turn. The final report includes an overall score, GD pass probability, contribution analysis, peer comparison, and missed opportunities.

**JAM Session**
Just A Minute — pick a topic, get a 3-second countdown, and speak for up to 60 seconds. Your voice is transcribed automatically and evaluated on relevance, clarity, depth, and confidence. The report includes an ideal answer outline and specific improvement tips.

---

## Tech Stack

**Frontend** — React 18, Vite, Tailwind CSS, React Router, Framer Motion, Recharts, Axios

**Backend** — FastAPI, Python, Groq SDK

**AI Models** — Qwen3 32B (resume analysis, interviews, JAM), Llama 4 Scout (group discussions), Whisper Large V3 Turbo (speech-to-text)

**APIs** — JSearch via RapidAPI (live job listings)

---

## Setup

### Prerequisites
- Node.js 18 or above
- Python 3.10 or above
- Groq API key — free at [console.groq.com](https://console.groq.com)
- JSearch API key — free tier at [rapidapi.com](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```
GROQ_API_KEY=your_groq_api_key
JSEARCH_API_KEY=your_jsearch_api_key
```

Start the server:

```bash
uvicorn main:app --reload --port 8000
```

API runs at `http://localhost:8000` — interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## Project Structure

```
ai-recruitment-simulator/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ResumeAnalyzer.jsx
│   │   │   ├── InterviewSim.jsx
│   │   │   ├── GDSimulator.jsx
│   │   │   └── JamSession.jsx
│   │   ├── components/
│   │   │   └── Layout.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── backend/
    ├── routers/
    │   ├── resume.py
    │   ├── interview.py
    │   ├── gd.py
    │   ├── jam.py
    │   ├── jobs.py
    │   └── mail.py
    ├── services/
    │   ├── groq_service.py
    │   └── parsers.py
    ├── main.py
    ├── requirements.txt
    └── .env
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/analyze` | Analyze resume file |
| POST | `/api/interview/parse-resume` | Extract resume text for interview context |
| POST | `/api/interview/start` | Send and receive interview messages |
| POST | `/api/interview/transcribe` | Transcribe voice recording |
| POST | `/api/interview/evaluate` | Generate interview report |
| GET | `/api/interview/rounds` | List available rounds |
| GET | `/api/gd/topics` | Get GD topics and participant info |
| POST | `/api/gd/moderate/open` | Get moderator opening statement |
| POST | `/api/gd/participant/speak` | Get AI participant response |
| POST | `/api/gd/evaluate` | Generate GD report |
| GET | `/api/jam/topics` | Get JAM topics |
| POST | `/api/jam/transcribe` | Transcribe JAM recording |
| POST | `/api/jam/evaluate` | Generate JAM report |
| POST | `/api/mail/generate` | Generate application email draft |
| GET | `/api/jobs` | Fetch live job listings |

---

Built for a Hackathon
