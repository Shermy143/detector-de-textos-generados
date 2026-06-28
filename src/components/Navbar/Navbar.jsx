/* Navbar component */
import './Navbar.css'
import logoUG from '../../assets/logo-ug.png'

export default function Navbar() {
  return (
    <header className="navbar" role="banner">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <img className="navbar__logo" src={logoUG} alt="Logo Universidad de Guayaquil" />
          <div className="navbar__divider" aria-hidden="true" />
          <span className="navbar__title">Detector de texto generado por IA</span>
        </div>
        <nav className="navbar__nav" aria-label="Navegación principal">
          <a className="navbar__link" href="#detector">Detectar</a>
        </nav>
      </div>
    </header>
  )
}
