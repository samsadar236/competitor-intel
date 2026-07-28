"""FastAPI entry point.

Thin HTTP layer over the existing engine. One real endpoint, /api/analyze,
which the Next.js frontend calls with {targetUrl, competitorUrls} and gets
back the structured AnalyzeResponse.

Note: analysis is a long, blocking call (~1-2 min for a few sites). That's fine
for v1. A production version would move this to a background job + polling or
Server-Sent Events so the frontend can stream real per-stage progress.
"""
from __future__ import annotations

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import AnalyzeRequest, AnalyzeResponse
from .service import run_analysis

load_dotenv()

app = FastAPI(title="Competitor Research Agent API", version="1.0.0")

# CORS: open for local dev. In production, replace ["*"] with your exact
# frontend origin, e.g. ["https://your-app.vercel.app"].
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    target = req.targetUrl.strip()
    competitors = [u.strip() for u in req.competitorUrls if u.strip()]
    if not target:
        raise HTTPException(status_code=400, detail="targetUrl is required")
    if not competitors:
        raise HTTPException(status_code=400, detail="At least one competitorUrl is required")
    try:
        return run_analysis(target, competitors)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}")
