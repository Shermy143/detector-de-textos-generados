---
title: Synthetic Sentinel API
emoji: 🔍
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# Synthetic Sentinel API — Backend

Backend FastAPI para detección de texto generado por IA.

## Endpoints

- `GET /health` — Health check
- `POST /predict` — Analizar texto (body: `{"text": "..."}`)

## Modelo

Utiliza el modelo `StyleDistance/mStyleDistance` fine-tuneado con clasificador personalizado (StyleAIClassifierV5).
