import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Users, Settings, Pencil, LogOut, AlignLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

const navItems = [
  { label: 'Dashboard',      icon: <LayoutDashboard size={16} />, path: '/dashboard' },
  { label: 'Trabajos',       icon: <Briefcase size={16} />,       path: '/trabajos' },
  { label: 'Clientes',       icon: <Users size={16} />,           path: '/clientes' },
  { label: 'Configuración',  icon: <Settings size={16} />,        path: '/configuracion' },
]

export function Sidebar({ etapas = [], user, mobileOpen, onClose }) {
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const handleNav = (path) => {
    navigate(path)
    if (onClose) onClose()
  }

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'U'

  return (
    <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <AlignLeft size={14} color="#6B5CE7" />
        </div>
        <div className="sidebar-logo-text">
          <span>Flow</span><span>Canvas</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <div
            key={item.path}
            className={`sidebar-nav-item${location.pathname === item.path ? ' active' : ''}`}
            onClick={() => handleNav(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Flujo actual */}
      {etapas.length > 0 && (
        <div className="sidebar-flow">
          <div className="sidebar-flow-label">Flujo actual</div>
          {etapas.map((e, i) => (
            <div key={e.id} className="sidebar-flow-item">
              <div className="sidebar-flow-dot" style={{ background: e.color }} />
              <span className="sidebar-flow-name">{e.nombre}</span>
              {i < etapas.length - 1 && <div className="sidebar-flow-line" />}
            </div>
          ))}
          <button className="sidebar-edit-btn" onClick={() => handleNav('/configuracion')}>
            <Pencil size={11} />
            <span>Editar flujo</span>
          </button>
        </div>
      )}

      {/* Usuario */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">{initials}</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.email?.split('@')[0] || 'Usuario'}</div>
          <div className="sidebar-user-role">Administrador</div>
        </div>
        <div className="sidebar-logout" onClick={handleLogout} title="Cerrar sesión">
          <LogOut size={15} />
        </div>
      </div>
    </aside>
  )
}
