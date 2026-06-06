# Synthetic Sentinel — Detector de IA · UG

## Cómo iniciar el proyecto localmente

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --port 8000
```

> El modelo se carga automáticamente al iniciar. La primera vez descarga el tokenizador
> de HuggingFace (`StyleDistance/mStyleDistance`). Los pesos del modelo se cargan
> desde `models/best_model.pt`.

### 2. Frontend (React + Vite)

```bash
# En la raíz del proyecto
npm run dev
```

La app estará disponible en `http://localhost:5173`

### 3. Producción (build)

```bash
npm run build
# Sirve el frontend estático desde FastAPI en http://localhost:8000
```

---

## Archivos de modelo (carpeta `models/`)

| Archivo                    | Descripción                                              |
|----------------------------|----------------------------------------------------------|
| `best_model.pt`            | Pesos del clasificador `StyleAIClassifierV5` (v9)        |
| `isotonic_calibrator.pkl`  | Calibrador isotónico entrenado con OOF 5-fold            |
| `threshold_config.json`    | Umbral, zona de abstención y pesos TTA                   |

---

## Pipeline de inferencia (v9)

1. **Preprocesamiento** — elimina URLs, @mentions, #hashtags, normaliza espacios
2. **TTA** — 3 pases: original + truncate 85% + span_mask 10%, pesos [0.5, 0.25, 0.25]
3. **Calibración isotónica** — corrige las probabilidades brutas del modelo
4. **Abstención** — zona [0.44, 0.56] → label `"Incierto"` con score 0.5

---

## Endpoints del API

| Método | Ruta       | Descripción                     |
|--------|------------|---------------------------------|
| GET    | `/health`  | Health check                    |
| POST   | `/predict` | Analizar texto → predicción IA  |

### Payload `/predict`
```json
{ "text": "Texto en español a analizar..." }
```

### Respuesta
```json
{
  "label":      "IA",
  "confidence": 97.4,
  "ai_prob":    97.4,
  "human_prob": 2.6,
  "word_count": 120,
  "abstained":  false
}
```

> `label` puede ser `"IA"`, `"Humano"` o `"Incierto"` (zona de abstención).
