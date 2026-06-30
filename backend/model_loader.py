"""
Model Loader — StyleAIClassifierV5 (v9)

Pipeline completo:
  1. Preprocesamiento del texto
  2. Inferencia con SentenceTransformer + clasificador (3 pases TTA)
  3. Calibración isotónica
  4. Abstención en zona de incertidumbre [0.44, 0.56]
"""
import os
import re
import gc
import json
import random
import pickle
import warnings
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from sentence_transformers import SentenceTransformer
from huggingface_hub import hf_hub_download

warnings.filterwarnings("ignore")

# ── Repositorio Hugging Face con los pesos del modelo ──────────────────────────
HF_REPO_ID = "Doffy143/mStyleDistance-finetunned"

# ── Rutas locales (para desarrollo) ───────────────────────────────────────────
_MODELS_DIR = Path(__file__).parent.parent / "models"

# ── Archivos del modelo y sus nombres en el repositorio HF ────────────────────
_MODEL_FILES = {
    "best_model.pt":           _MODELS_DIR / "best_model.pt",
    "isotonic_calibrator.pkl": _MODELS_DIR / "isotonic_calibrator.pkl",
    "threshold_config.json":   _MODELS_DIR / "threshold_config.json",
}


def _resolve_file(filename: str) -> str:
    """Busca el archivo local; si no existe, lo descarga desde Hugging Face."""
    local_path = _MODEL_FILES[filename]

    if local_path.exists():
        print(f"[model_loader] '{filename}' encontrado localmente.")
        return str(local_path)

    print(f"[model_loader] '{filename}' no encontrado localmente, descargando desde HF...")
    downloaded = hf_hub_download(
        repo_id=HF_REPO_ID,
        filename=filename,
        cache_dir=os.environ.get("HF_HOME", None),
    )
    print(f"[model_loader] '{filename}' descargado en: {downloaded}")
    return downloaded


# ── Rutas resueltas (se calculan en load_model) ──────────────────────────────
MODEL_PATH      = None
CALIBRATOR_PATH = None
THRESHOLD_PATH  = None

# ── Hiperparámetros de inferencia (alineados con CONFIG del notebook v9) ───────
MODEL_NAME = "StyleDistance/mStyleDistance"
MAX_LENGTH = 256
DEVICE     = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# ── Arquitectura (StyleAIClassifierV5 — igual que en el notebook v9) ──────────
class StyleAIClassifierV5(nn.Module):
    """
    Encoder SentenceTransformer + cabeza clasificadora 768→384→2.
    Idéntico al notebook de entrenamiento v9.
    """
    def __init__(self, encoder_model, num_classes: int = 2,
                 dropout: float = 0.20, hidden_dim: int = 384):
        super().__init__()
        self.encoder       = encoder_model
        self.embedding_dim = encoder_model.get_sentence_embedding_dimension()
        self.classifier    = nn.Sequential(
            nn.LayerNorm(self.embedding_dim),
            nn.Dropout(dropout),
            nn.Linear(self.embedding_dim, hidden_dim),
            nn.GELU(),
            nn.LayerNorm(hidden_dim),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, num_classes),
        )

    def forward(self, input_ids, attention_mask):
        features   = {"input_ids": input_ids, "attention_mask": attention_mask}
        embeddings = self.encoder(features)["sentence_embedding"].to(torch.float32)
        return self.classifier(embeddings)


# ── Preprocesamiento (igual al notebook v9) ────────────────────────────────────
def _preprocess(text: str) -> str:
    """Elimina URLs, @usuarios, #hashtags y normaliza espacios preservando párrafos."""
    if not isinstance(text, str) or not text.strip():
        return ""
    text = re.sub(r"http\S+|www\S+|https\S+", "", text, flags=re.MULTILINE)
    text = re.sub(r"@\w+|#\w+", "", text)
    text = re.sub(r"[^\S\n]+", " ", text)
    text = re.sub(r"\n\s*\n", "\n\n", text)
    return text.strip()


# ── Variantes TTA (sobre strings, no sobre tokens) ────────────────────────────
def _tta_truncate(text: str, ratio: float = 0.85) -> str:
    """Recorta el texto al ratio indicado de palabras."""
    words = text.split()
    if len(words) < 20:
        return text
    return " ".join(words[: int(len(words) * ratio)])


def _tta_span_mask(text: str, span_ratio: float = 0.10) -> str:
    """Enmascara un span aleatorio del texto."""
    words = text.split()
    if len(words) < 10:
        return text
    n     = max(1, int(len(words) * span_ratio))
    start = random.randint(0, max(0, len(words) - n))
    words[start : start + n] = ["[MASK]"] * n
    return " ".join(words)


# ── Tokenización y predicción en batch ────────────────────────────────────────
def _encode_and_predict(model: StyleAIClassifierV5, texts: list[str],
                        tokenizer, max_length: int) -> list[float]:
    """Devuelve la probabilidad de clase IA (índice 1) para cada texto."""
    encoding = tokenizer(
        texts,
        max_length=max_length,
        padding="max_length",
        truncation=True,
        return_tensors="pt",
    )
    input_ids      = encoding["input_ids"].to(DEVICE)
    attention_mask = encoding["attention_mask"].to(DEVICE)

    with torch.no_grad():
        logits = model(input_ids, attention_mask)
        probs  = F.softmax(logits, dim=-1)

    return probs[:, 1].cpu().tolist()


# ── Singleton — modelo, calibrador y config se cargan una sola vez ─────────────
_model      = None
_tokenizer  = None
_calibrator = None
_threshold_cfg: dict = {}


def load_model():
    """Carga el modelo, calibrador y configuración de umbral (singleton)."""
    global _model, _tokenizer, _calibrator, _threshold_cfg
    global MODEL_PATH, CALIBRATOR_PATH, THRESHOLD_PATH

    if _model is not None:
        return _model, _tokenizer, _calibrator, _threshold_cfg

    # ── Resolver rutas (local o Hugging Face) ──────────────────────────────────
    MODEL_PATH      = _resolve_file("best_model.pt")
    CALIBRATOR_PATH = _resolve_file("isotonic_calibrator.pkl")
    THRESHOLD_PATH  = _resolve_file("threshold_config.json")

    print(f"[model_loader] Cargando encoder base '{MODEL_NAME}'...")
    encoder    = SentenceTransformer(MODEL_NAME)
    _tokenizer = encoder.tokenizer

    print(f"[model_loader] Cargando pesos desde '{MODEL_PATH}'...")
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)

    # El checkpoint guarda el estado completo del modelo (encoder + classifier).
    # Las claves tienen el prefijo "encoder.0.model.*" porque SentenceTransformer
    # almacena el transformer como encoder[0].auto_model. Construimos el modelo
    # y cargamos el state_dict completo sobre él.
    cfg_saved   = checkpoint.get("config", {})
    hidden_dim  = cfg_saved.get("HIDDEN_DIM", 384)
    dropout     = cfg_saved.get("DROPOUT", 0.20)

    _model = StyleAIClassifierV5(
        encoder_model=encoder,
        hidden_dim=hidden_dim,
        dropout=dropout,
    ).float().to(DEVICE)

    # Remapeo de claves: versiones antiguas de sentence-transformers guardaban los
    # pesos del transformer bajo "encoder.0.model.*"; versiones nuevas los exponen
    # como "encoder.0.auto_model.*". Normalizamos antes de cargar.
    raw_sd = checkpoint["model_state_dict"]
    remapped_sd = {}
    for k, v in raw_sd.items():
        new_k = k.replace("encoder.0.model.", "encoder.0.auto_model.")
        remapped_sd[new_k] = v

    missing, unexpected = _model.load_state_dict(remapped_sd, strict=False)
    if missing:
        print(f"[model_loader] WARN: Claves faltantes ({len(missing)}): {missing[:5]}")
    if unexpected:
        print(f"[model_loader] WARN: Claves inesperadas ({len(unexpected)}): {unexpected[:5]}")
    if not missing and not unexpected:
        print("[model_loader] State dict cargado sin discrepancias.")

    _model.eval()

    print(f"[model_loader] Cargando calibrador desde '{CALIBRATOR_PATH}'...")
    with open(CALIBRATOR_PATH, "rb") as f:
        _calibrator = pickle.load(f)

    print(f"[model_loader] Cargando configuracion de umbral desde '{THRESHOLD_PATH}'...")
    with open(THRESHOLD_PATH, "r") as f:
        _threshold_cfg = json.load(f)

    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

    print("[model_loader] Pipeline listo.")
    print(f"[model_loader] Dispositivo: {DEVICE}")
    return _model, _tokenizer, _calibrator, _threshold_cfg


# ── Inferencia principal ───────────────────────────────────────────────────────
def predict(text: str) -> dict:
    """
    Ejecuta el pipeline completo: preproceso → TTA → calibración → abstención.

    Retorna:
        {
          "label":      "IA" | "Humano" | "Incierto",
          "confidence": float  (0–100),
          "ai_prob":    float  (0–100),
          "human_prob": float  (0–100),
          "word_count": int,
          "abstained":  bool
        }
    """
    model, tokenizer, calibrator, cfg = load_model()

    # ── 1. Preprocesamiento ────────────────────────────────────────────────────
    cleaned = _preprocess(text)

    # ── 2. TTA: pesos [0.5, 0.25, 0.25] ──────────────────────────────────────
    tta_texts   = [cleaned, _tta_truncate(cleaned), _tta_span_mask(cleaned)]
    tta_weights = cfg.get("tta_weights", [0.5, 0.25, 0.25])

    # Batch único con los 3 pases TTA para eficiencia
    raw_probs = _encode_and_predict(model, tta_texts, tokenizer, MAX_LENGTH)

    # Promedio ponderado de las probabilidades AI de los tres pases
    ai_raw = sum(w * p for w, p in zip(tta_weights, raw_probs))

    # ── 3. Calibración isotónica ───────────────────────────────────────────────
    # IsotonicRegression.predict() espera array 1D de shape (n_samples,)
    ai_calibrated = float(calibrator.predict(np.array([ai_raw]))[0])

    # ── 4. Abstención ──────────────────────────────────────────────────────────
    abstain_low  = cfg.get("abstain_low",  0.44)
    abstain_high = cfg.get("abstain_high", 0.56)
    threshold    = cfg.get("threshold",    0.50)

    abstained = abstain_low <= ai_calibrated <= abstain_high

    if abstained:
        label      = "Incierto"
        confidence = round((1 - abs(ai_calibrated - 0.5) * 2) * 100, 2)
    elif ai_calibrated > threshold:
        label      = "IA"
        confidence = round(ai_calibrated * 100, 2)
    else:
        label      = "Humano"
        confidence = round((1 - ai_calibrated) * 100, 2)

    return {
        "label":      label,
        "confidence": confidence,
        "ai_prob":    round(ai_calibrated * 100, 2),
        "human_prob": round((1 - ai_calibrated) * 100, 2),
        "word_count": len(cleaned.split()),
        "abstained":  abstained,
    }
