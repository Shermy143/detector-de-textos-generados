/* Página de presentación del proyecto */
import './LandingPage.css'

import logoUG       from '../../assets/logo-ug.png'
import logoFacultad from '../../assets/logo-facultad.png'
import heroIA       from '../../assets/IA.jpg'

export default function LandingPage({ onContinue }) {
  return (
    <main className="landing" aria-label="Presentación del proyecto">

      {/* Layout principal: contenido izquierda + imagen derecha */}
      <div className="landing__content">

        {/* ─── Columna izquierda ───────────────────────────────────── */}
        <article className="landing__left">

          {/* Logos institucionales */}
          <div className="landing__logos">
            <img
              className="landing__logo"
              src={logoUG}
              alt="Logo Universidad de Guayaquil"
            />
            <div className="landing__logos-divider" aria-hidden="true" />
            <img
              className="landing__logo landing__logo--facultad"
              src={logoFacultad}
              alt="Logo Facultad de Ciencias Matemáticas y Físicas"
            />
          </div>


          {/* Título principal */}
          <h1 className="landing__university-name">
            Universidad de Guayaquil
          </h1>

          {/* Subtítulo del detector */}
          <h2 className="landing__title">
            Detector de texto<br />generado por{' '}
            <span>Inteligencia Artificial</span>
          </h2>

          {/* Información del proyecto */}
          <section className="landing__info" aria-label="Información del proyecto">

            {/* ¿Qué es? */}
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

            {/* Compatibilidad de idiomas */}
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

        {/* ─── Columna derecha: imagen hero ────────────────────────── */}
        <aside className="landing__right" aria-hidden="true">
          <div className="landing__hero-wrapper">
            <img
              className="landing__hero-image"
              src={heroIA}
              alt="Ilustración de Inteligencia Artificial"
            />
            {/* Glow decorativo */}
            <div className="landing__hero-glow" />
          </div>
        </aside>

      </div>
    </main>
  )
}
