/* Sidebar informational panel */
import './Sidebar.css'
import logoFacultad from '../../assets/logo-facultad.png'

const FEATURES = [
  { icon: 'verified_user', label: '99.8% de precisión en detección' },
  { icon: 'bolt',          label: 'Procesamiento en tiempo real'    },
  { icon: 'description',   label: 'Soporte multiformato'            },
  { icon: 'language',      label: 'Optimizado para español'         },
]

export default function Sidebar() {
  return (
    <div className="sidebar">
      {/* Info card */}
      <div className="sidebar__card">
        <div>
          <span className="sidebar__section-label">Capacidades</span>
          <h2 className="sidebar__card-title">Synthetic Sentinel</h2>
        </div>
        <p className="sidebar__card-desc">
          Motor neuronal basado en <strong>mStyleDistance</strong> que detecta patrones de
          sintaxis, perplejidad y ráfagas para identificar textos generados por IA.
        </p>
        <div className="sidebar__divider" aria-hidden="true" />
        <ul className="sidebar__features">
          {FEATURES.map(({ icon, label }) => (
            <li key={icon} className="sidebar__feature">
              <span className="material-symbols-outlined sidebar__feature-icon">{icon}</span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Faculty badge */}
      <div className="sidebar__badge">
        <img
          className="sidebar__badge-logo"
          src={logoFacultad}
          alt="Logo Facultad de Ciencias Matemáticas y Físicas"
        />
        <p className="sidebar__badge-label">
          Facultad de Ciencias<br />Matemáticas y Físicas
        </p>
      </div>
    </div>
  )
}
