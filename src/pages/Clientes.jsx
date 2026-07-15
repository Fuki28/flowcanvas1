import { useState, useEffect, useCallback } from 'react'
import { Plus, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Sidebar } from '../components/Sidebar.jsx'
import { Topbar } from '../components/Topbar.jsx'
import { Modal } from '../components/Modal.jsx'
import { ToastContainer } from '../components/Toast.jsx'
import { useToast } from '../hooks/useToast.js'

function hashColor(str) {
  const palette = ['#6B5CE7','#F5A623','#3B82F6','#22C55E','#EF4444','#9B59B6','#4ECDC4','#E8664A']
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return palette[Math.abs(h) % palette.length]
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export function Clientes() {
  const [etapas,   setEtapas]   = useState([])
  const [clientes, setClientes] = useState([])
  const [counts,   setCounts]   = useState({})
  const [user,     setUser]     = useState(null)
  const [modal,    setModal]    = useState(false)
  const [nombre,   setNombre]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toasts, showToast, removeToast } = useToast()

  const loadAll = useCallback(async () => {
    const [{ data: e }, { data: c }, { data: t }] = await Promise.all([
      supabase.from('etapas').select('*').order('orden'),
      supabase.from('clientes').select('*').order('nombre'),
      supabase.from('trabajos').select('cliente_id, etapa_id'),
    ])
    setEtapas(e || [])
    setClientes(c || [])

    // Contar trabajos activos por cliente
    const map = {}
    ;(t || []).forEach(tr => {
      if (tr.cliente_id) {
        map[tr.cliente_id] = (map[tr.cliente_id] || 0) + 1
      }
    })
    setCounts(map)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    loadAll()
  }, [loadAll])

  const handleCreate = async () => {
    if (!nombre.trim()) return
    setLoading(true)
    const { error } = await supabase.from('clientes').insert([{ nombre: nombre.trim() }])
    setLoading(false)
    if (error) { showToast(error.message, 'error'); return }
    setModal(false)
    setNombre('')
    loadAll()
    showToast('Cliente creado', 'success')
  }

  return (
    <div className="app-layout">
      <div className="sidebar-overlay" style={{ display: mobileOpen ? 'block' : 'none' }} onClick={() => setMobileOpen(false)} />
      <Sidebar etapas={etapas} user={user} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="main-content">
        <Topbar title="Clientes" subtitle="Gestiona tu base de clientes." onMenuClick={() => setMobileOpen(true)} />
        <div className="page-body">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <button className="btn btn-primary" onClick={() => setModal(true)}>
              <Plus size={15} />
              Nuevo cliente
            </button>
          </div>

          {clientes.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <p>No hay clientes registrados.</p>
              <button className="btn btn-primary" onClick={() => setModal(true)}>
                Agregar el primero
              </button>
            </div>
          ) : (
            <div className="client-grid">
              {clientes.map(c => (
                <div key={c.id} className="client-card">
                  <div className="client-avatar" style={{ background: hashColor(c.nombre) }}>
                    {getInitials(c.nombre)}
                  </div>
                  <div className="client-name">{c.nombre}</div>
                  <div className="client-count">
                    {counts[c.id] || 0} trabajo{(counts[c.id] || 0) !== 1 ? 's' : ''} activo{(counts[c.id] || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <Modal
          title="Nuevo cliente"
          onClose={() => { setModal(false); setNombre('') }}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => { setModal(false); setNombre('') }}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={loading || !nombre.trim()}>
                {loading ? 'Guardando...' : 'Crear cliente'}
              </button>
            </>
          }
        >
          <div className="field">
            <label>Nombre del cliente</label>
            <input className="input" placeholder="Ej: Restaurante Sabor"
              value={nombre} onChange={e => setNombre(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()} />
          </div>
        </Modal>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
