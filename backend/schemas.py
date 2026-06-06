"""
Pydantic schemas — request / response contracts (v9)
"""
from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    """Payload esperado en POST /predict."""
    text: str = Field(..., min_length=1, description="Texto en español a analizar")


class PredictResponse(BaseModel):
    """Resultado estructurado del pipeline de detección."""
    label:      str   # "IA" | "Humano" | "Incierto"
    confidence: float # confianza de la predicción (0-100)
    ai_prob:    float # probabilidad de ser IA calibrada (0-100)
    human_prob: float # probabilidad de ser humano calibrada (0-100)
    word_count: int
    abstained:  bool  # True si el score cae en la zona de abstención [0.44, 0.56]
