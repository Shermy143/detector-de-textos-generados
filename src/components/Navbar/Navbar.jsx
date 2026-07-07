/* Navbar component */
import './Navbar.css'
import logoUG from '../../assets/logo-ug.png'

export default function Navbar({ onBack }) {
  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <div className="navbar__brand">
          {/* Botón de retroceso al landing */}
          {onBack && (
            <button
              className="navbar__back"
              onClick={onBack}
              aria-label="Volver a la página principal"
            >
              <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
            </button>
          )}
          <img className="navbar__logo" src={logoUG} alt="Logo Universidad de Guayaquil" />
          <div className="navbar__divider" aria-hidden="true" />
          <span className="navbar__title">Detector de texto generado por IA</span>
        </div>
      </div>
    </header>
  )
}
