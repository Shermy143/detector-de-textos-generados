"""
FastAPI application entry point — Detector de IA
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from schemas      import PredictRequest, PredictResponse
from model_loader import load_model, predict as run_inference


# ── Lifespan: eager model loading on startup ───────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title       = "Synthetic Sentinel API",
    description = "Detección de texto generado por IA — Universidad de Guayaquil",
    version     = "2.0.0",
    lifespan    = lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins  = ["*"],
    allow_methods  = ["GET", "POST"],
    allow_headers  = ["*"],
)


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/health", summary="Health check")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse, summary="Analizar texto")
def predict(body: PredictRequest):
    """Receive Spanish text and return AI-detection probability."""
    if not body.text.strip():
        raise HTTPException(status_code=422, detail="El texto no puede estar vacío.")

    try:
        result = run_inference(body.text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return PredictResponse(**result)


# ── Static frontend (production) ───────────────────────────────────────────────
_static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(_static_dir):
    app.mount("/", StaticFiles(directory=_static_dir, html=True), name="frontend")
