/* Results & prediction display component */
import './ResultsPanel.css'

/* ── Idle placeholder ─────────────────────────────────────────────────────── */
function IdleState() {
  return (
    <>
      <div className="results__header">
        <span className="results__meta-label">Estado del Análisis</span>
        <h2 className="results__title results__title--idle">Listo para escanear</h2>
        <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Pegue su contenido arriba. Nuestro motor neuronal analizará patrones de sintaxis,
          perplejidad y ráfagas con calibración isotónica.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[
          ['verified_user', '98% de precisión en detección'],
          ['bolt',          'TTA + calibración isotónica'],
          ['description',   'Soporte multiformato'],
        ].map(([icon, label]) => (
          <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>{icon}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── Loading skeleton ──────────────────────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="results__skeleton" aria-label="Analizando texto…" role="status">
      <div className="results__skeleton-line results__skeleton-line--sm" />
      <div className="results__skeleton-line results__skeleton-line--lg" />
      <div className="results__skeleton-line results__skeleton-line--bar" />
      <div className="results__skeleton-line" style={{ width: '70%' }} />
    </div>
  )
}

/* ── Prediction result ─────────────────────────────────────────────────────── */
function ResultState({ result }) {
  const isAI       = result.label === 'IA'
  const isUncertain = result.label === 'Incierto'

  /* Modifier CSS según el label */
  const titleMod = isAI ? 'results__title--ai' : isUncertain ? 'results__title--uncertain' : 'results__title--human'
  const confMod  = isAI ? '' : isUncertain ? 'results__confidence--uncertain' : 'results__confidence--human'

  return (
    <>
      {/* Header */}
      <div className="results__top-row">
        <div className="results__header">
          <span className="results__meta-label">Resultado Principal</span>
          <h2 className={`results__title ${titleMod}`}>
            {isUncertain ? 'Texto Incierto' : `Detectado: ${result.label}`}
          </h2>
          {/* Badge de abstención */}
          {isUncertain && (
            <span className="results__abstain-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>help</span>
              Zona de abstención [{result.ai_prob}%]
            </span>
          )}
        </div>
        <div className={`results__confidence ${confMod}`}>
          <span className="results__meta-label">Nivel de Confianza</span>
          <p className="results__confidence-value">{result.confidence}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="results__bar-wrapper">
        <div className="results__bar-labels">
          <span>Contenido Humano</span>
          <span>Contenido IA</span>
        </div>
        <div className="results__bar-track" role="progressbar" aria-valuenow={result.ai_prob} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`results__bar-fill ${isUncertain ? 'results__bar-fill--uncertain' : ''}`}
            style={{ width: `${result.ai_prob}%` }}
          />
        </div>
      </div>

      {/* Detail chips */}
      <div className="results__chips">
        <div className="results__chip">
          <span className="results__chip-label">Prob. IA</span>
          <span className="results__chip-value">{result.ai_prob}%</span>
        </div>
        <div className="results__chip">
          <span className="results__chip-label">Prob. Humano</span>
          <span className="results__chip-value">{result.human_prob}%</span>
        </div>
        <div className="results__chip">
          <span className="results__chip-label">Palabras</span>
          <span className="results__chip-value">{result.word_count}</span>
        </div>
      </div>
    </>
  )
}

/* ── Error state ───────────────────────────────────────────────────────────── */
function ErrorState({ message }) {
  return (
    <div className="results__error" role="alert">
      <span className="material-symbols-outlined">error</span>
      {message || 'Ocurrió un error al analizar el texto. Intente nuevamente.'}
    </div>
  )
}

/* ── Main component ────────────────────────────────────────────────────────── */
export default function ResultsPanel({ loading, result, error }) {
  return (
    <aside className="results" aria-label="Panel de resultados">
      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} />}
      {!loading && !error && result && <ResultState result={result} />}
      {!loading && !error && !result && <IdleState />}
    </aside>
  )
}
