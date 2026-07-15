import { useState } from 'react'
import { Modal } from './Modal.jsx'
import { supabase } from '../lib/supabase'

export function NewWorkModal({ etapas, clientes, onClose, onCreated, defaultEtapaId }) {
  const [form, setForm] = useState({
    nombre: '',
    cliente_id: '',
    etapa_id: defaultEtapaId || (etapas[0]?.id || ''),
    prioridad: 'media',
    descripcion: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async () => {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio'); return }
    setLoading(true)
    const { data, error: err } = await supabase
      .from('trabajos')
      .insert([{
        nombre:      form.nombre.trim(),
        cliente_id:  form.cliente_id  || null,
        etapa_id:    form.etapa_id    || null,
        prioridad:   form.prioridad,
        descripcion: form.descripcion.trim() || null,
      }])
      .select()
      .single()

    if (err) { setError(err.message); setLoading(false); return }

    // Registrar en historial
    if (data && form.etapa_id) {
      await supabase.from('historial_etapas').insert([{
        trabajo_id: data.id,
        etapa_id:   form.etapa_id,
      }])
    }

    setLoading(false)
    onCreated(data)
  }

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <Modal
      title="Nuevo trabajo"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Crear trabajo'}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && <div className="login-error">{error}</div>}

        <div className="field">
          <label>Nombre del trabajo *</label>
          <input className="input" placeholder="Ej: Catálogo verano 2026"
            value={form.nombre} onChange={e => set('nombre', e.target.value)} />
        </div>

        <div className="field">
          <label>Cliente</label>
          <select className="select" value={form.cliente_id} onChange={e => set('cliente_id', e.target.value)}>
            <option value="">Sin cliente</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Etapa inicial</label>
            <select className="select" value={form.etapa_id} onChange={e => set('etapa_id', e.target.value)}>
              {etapas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Prioridad</label>
            <select className="select" value={form.prioridad} onChange={e => set('prioridad', e.target.value)}>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Descripción</label>
          <textarea className="textarea" placeholder="Descripción opcional del trabajo..."
            value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
        </div>
      </div>
    </Modal>
  )
}
