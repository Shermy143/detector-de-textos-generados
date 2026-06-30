/**
 * API service — communication layer with the FastAPI backend
 *
 * - Desarrollo local: rutas relativas → proxy de Vite → localhost:8000
 * - Producción (Vercel): URL directa al HF Space
 */

const HF_SPACE_URL = 'https://doffy143-mstyledistance-finetunned.hf.space'

const _isLocalDev = typeof window !== 'undefined'
  && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

const API_BASE = import.meta.env.VITE_API_URL || (_isLocalDev ? '' : HF_SPACE_URL)

/**
 * Send text to /predict and return prediction result.
 * @param {string} text
 * @returns {Promise<{label, confidence, ai_prob, human_prob, word_count}>}
 */
export async function analyzeText(text) {
  const response = await fetch(`${API_BASE}/predict`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ text }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.detail || `Error ${response.status}`)
  }

  return response.json()
}
