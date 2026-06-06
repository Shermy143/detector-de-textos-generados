/* Editor workspace component */
import { useMemo }    from 'react'
import './Editor.css'

export default function Editor({ text, onChange, onAnalyze, loading }) {
  /* Word count derived from textarea value */
  const wordCount = useMemo(
    () => (text.trim() ? text.trim().split(/\s+/).length : 0),
    [text]
  )

  return (
    <div className="editor">
      <textarea
        id="editor-textarea"
        className="editor__textarea"
        placeholder="Pegue el texto a analizar (se recomiendan mínimo 50 palabras para mayor precisión)…"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Área de texto para análisis"
        spellCheck={false}
      />

      <div className="editor__toolbar">
        {/* Stats */}
        <div className="editor__stats" aria-label="Estadísticas del texto">
          <div className="editor__stat">
            <span className="editor__stat-label">Conteo de palabras</span>
            <span className="editor__stat-value" aria-live="polite">{wordCount}</span>
          </div>
          <div className="editor__stat-divider" aria-hidden="true" />
          <div className="editor__stat">
            <span className="editor__stat-label">Tiempo estimado</span>
            <span className="editor__stat-value">~2s</span>
          </div>
        </div>

        {/* Analyze button */}
        <button
          id="analyze-btn"
          className="editor__btn"
          onClick={onAnalyze}
          disabled={loading || wordCount === 0}
          aria-busy={loading}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {loading ? 'hourglass_top' : 'analytics'}
          </span>
          {loading ? 'Analizando…' : 'Analizar'}
        </button>
      </div>
    </div>
  )
}
