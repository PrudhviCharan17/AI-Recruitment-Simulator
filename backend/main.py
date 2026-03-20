from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, interview, gd, jobs, jam, mail



app = FastAPI(title="AI Recruitment Simulator API", version="1.0.0")

# ── Middleware first, always ──────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────
app.include_router(jam.router, prefix="/api/jam")
app.include_router(mail.router, prefix="/api/mail")
app.include_router(resume.router,    prefix="/api/resume",    tags=["Resume Analyzer"])
app.include_router(interview.router, prefix="/api/interview", tags=["Interview Simulator"])
app.include_router(gd.router,        prefix="/api/gd",        tags=["GD Simulator"])
app.include_router(jobs.router,      prefix="/api",           tags=["Job Search"])

@app.get("/")
def root():
    return {"message": "AI Recruitment Simulator API is running"}
