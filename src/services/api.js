/**
 * API service — communication layer with the FastAPI backend
 */

const API_BASE = import.meta.env.VITE_API_URL || ''

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
