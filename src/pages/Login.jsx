import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlignLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ETAPAS_PREVIEW = [
  { nombre: 'Pedido',       color: '#6B5CE7', cards: [{ w: '80%' }, { w: '60%' }] },
  { nombre: 'Diseño',       color: '#F5A623', cards: [{ w: '70%' }, { w: '85%' }] },
  { nombre: 'Producción',   color: '#3B82F6', cards: [{ w: '65%' }] },
  { nombre: 'Entrega',      color: '#22C55E', cards: [{ w: '75%' }] },
]

function KanbanPreview() {
  return (
    <div className="kp-board">
      {ETAPAS_PREVIEW.map(col => (
        <div key={col.nombre} className="kp-col" style={{ background: col.color + '18' }}>
          <div className="kp-col-head" style={{ background: col.color, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', opacity: 0.8, display: 'inline-block' }} />
            <span style={{ fontSize: 10 }}>{col.nombre}</span>
          </div>
          <div className="kp-cards">
            {col.cards.map((c, i) => (
              <div key={i} className="kp-card">
                <div className="kp-card-dot" style={{ background: col.color }} />
                <div className="kp-card-lines">
                  <div className="kp-card-line w80" />
                  <div className="kp-card-line" style={{ width: c.w }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  const [mode,  setMode]    = useState('login')   // 'login' | 'register'
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass })
      if (err) { setError(err.message); setLoading(false); return }
      navigate('/dashboard')
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password: pass })
      if (err) { setError(err.message); setLoading(false); return }
      setError('')
      setMode('login')
      setLoading(false)
      alert('Cuenta creada. Revisa tu correo para confirmar (si está habilitado) y luego inicia sesión.')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      {/* Panel izquierdo */}
      <div className="login-left">
        <div className="login-form-box">
          <div className="login-logo">
            <div className="login-mark">
              <AlignLeft size={16} color="#6B5CE7" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700 }}>
              <span style={{ color: '#1E2235' }}>Flow</span>
              <span style={{ color: '#6B5CE7' }}>Canvas</span>
            </span>
          </div>

          <div className="login-headline">
            {mode === 'login' ? (
              <>Te damos la bienvenida a <span>FlowCanvas</span></>
            ) : (
              <>Crea tu cuenta en <span>FlowCanvas</span></>
            )}
          </div>
          <div className="login-sub">
            Organiza y visualiza el flujo de trabajo de tu empresa en un solo lugar.
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="field">
              <label>Correo electrónico</label>
              <input
                className="input"
                type="email"
                placeholder="ejemplo@empresa.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Contraseña</label>
              <input
                className="input"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button className="btn btn-primary login-cta" type="submit" disabled={loading}
              style={{ width: '100%', height: 48, fontSize: 14 }}>
              {loading ? 'Cargando...' : (mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
            </button>
          </form>

          <div className="login-footer">
            {mode === 'login' ? (
              <>¿No tienes cuenta?{' '}
                <a onClick={() => { setMode('register'); setError('') }}>Crear cuenta</a>
              </>
            ) : (
              <>¿Ya tienes cuenta?{' '}
                <a onClick={() => { setMode('login'); setError('') }}>Iniciar sesión</a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="login-right">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            Todo tu trabajo,
          </div>
          <div style={{ color: '#6B5CE7', fontSize: 22, fontWeight: 700 }}>
            en un solo lugar.
          </div>
        </div>
        <KanbanPreview />
        <div style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
          Tu flujo, tu forma.
        </div>
      </div>
    </div>
  )
}
