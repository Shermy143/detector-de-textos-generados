/* Página de presentación del proyecto */
import './LandingPage.css'

export default function LandingPage({ onContinue }) {
  return (
    <main className="landing" aria-label="Presentación del proyecto">
      <article className="landing__card">

        {/* Badge institucional */}
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <span className="landing__badge">
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>school</span>
            Universidad de Guayaquil · IA
          </span>

          <h1 className="landing__title">
            Detector de texto<br />generado por{' '}
            <span>Inteligencia Artificial</span>
          </h1>
        </header>

        {/* Información del proyecto */}
        <section className="landing__info" aria-label="Información del proyecto">

          <div className="landing__info-item">
            <span className="material-symbols-outlined landing__info-icon">psychology</span>
            <div className="landing__info-text">
              <span className="landing__info-label">¿Qué es?</span>
              <p className="landing__info-desc">
                Herramienta de análisis que determina si un texto fue escrito por
                un humano o generado por un modelo de <strong>Inteligencia Artificial</strong>.
              </p>
            </div>
          </div>

          <div className="landing__info-item">
            <span className="material-symbols-outlined landing__info-icon">model_training</span>
            <div className="landing__info-text">
              <span className="landing__info-label">Modelo base</span>
              <p className="landing__info-desc">
                Motor neuronal basado en <strong>mStyleDistance</strong>, entrenado con
                técnicas de calibración isotónica y Test-Time Augmentation (TTA)
                para alcanzar un <strong>98% de precisión</strong> en detección.
              </p>
            </div>
          </div>

          <div className="landing__info-item">
            <span className="material-symbols-outlined landing__info-icon">translate</span>
            <div className="landing__info-text">
              <span className="landing__info-label">Compatibilidad de idiomas</span>
              <p className="landing__info-desc">
                El modelo fue entrenado originalmente en <strong>inglés</strong> y
                extendido para operar eficazmente con textos en <strong>español</strong>.
              </p>
            </div>
          </div>

        </section>

        {/* Divisor */}
        <div className="landing__divider" aria-hidden="true" />

        {/* Creadores */}
        <footer className="landing__authors" aria-label="Autores del proyecto">
          <span className="landing__authors-label">Desarrollado por</span>
          <div className="landing__authors-list">
            <span className="landing__author">Castro Illescas Jeremy Isaac</span>
            <span className="landing__author">Lara Jama Janis Odeth</span>
          </div>
        </footer>

        {/* CTA */}
        <button
          id="continue-btn"
          className="landing__btn"
          onClick={onContinue}
          aria-label="Ir al detector de texto"
        >
          Continuar
          <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }} aria-hidden="true">
            arrow_forward
          </span>
        </button>

      </article>
    </main>
  )
}
