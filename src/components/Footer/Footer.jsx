/* Footer component */
import './Footer.css'
import logoUG from '../../assets/logo-ug.png'

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <img className="footer__logo" src={logoUG} alt="Logo Universidad de Guayaquil" />
          <div className="footer__brand-info">
            <span className="footer__brand-name">Detector de texto generado por IA — UG</span>
            <span className="footer__brand-tagline">Transparencia y precisión académica.</span>
          </div>
        </div>
        <p className="footer__copy">
          © {new Date().getFullYear()} Universidad de Guayaquil. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
