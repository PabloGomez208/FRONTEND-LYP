import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'
import { listarDisponibilidad, crearDisponibilidad, actualizarDisponibilidad, eliminarDisponibilidad, cambiarEstadoDisponibilidad } from '../lib/api/citas'

export default function VetDisponibilidad() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fecha, setFecha] = useState('')
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [estado, setEstado] = useState('disponible')
  const [editId, setEditId] = useState(null)
  const [editFecha, setEditFecha] = useState('')
  const [editInicio, setEditInicio] = useState('')
  const [editFin, setEditFin] = useState('')
  const [editEstado, setEditEstado] = useState('disponible')

  async function load() {
    setError('')
    try {
      const data = await listarDisponibilidad()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudo cargar la disponibilidad')
    }
  }
  useEffect(() => { load() }, [])

  async function onCreate(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await crearDisponibilidad({ fecha, hora_inicio: inicio, hora_fin: fin, estado })
      setFecha(''); setInicio(''); setFin(''); setEstado('disponible')
      await load()
    } catch {
      setError('No se pudo crear la disponibilidad')
    } finally { setLoading(false) }
  }

  async function onSave(id) {
    setLoading(true)
    setError('')
    try {
      // if only the estado changed we can hit the lightweight PATCH endpoint
      const original = items.find((d) => d.id_disponibilidad === id)
      if (original && original.estado !== editEstado) {
        await cambiarEstadoDisponibilidad(Number(id), editEstado)
      }
      // still update the remainder of the record in case fecha/hora were modified
      await actualizarDisponibilidad(Number(id), { fecha: editFecha, hora_inicio: editInicio, hora_fin: editFin, estado: editEstado })
      setEditId(null)
      await load()
    } catch {
      setError('No se pudo actualizar')
    } finally { setLoading(false) }
  }

  async function onDelete(id) {
    setLoading(true)
    setError('')
    try {
      await eliminarDisponibilidad(Number(id))
      await load()
    } catch {
      setError('No se pudo eliminar')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <Header />
      <Hero full>
        <div style={{ width: '100%', maxWidth: 900 }}>
          <div style={{
            background: 'rgba(17,17,17,0.75)',
            color: '#fff',
            borderRadius: 16,
            padding: 24,
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Disponibilidad</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>Monta tus citas disponibles</p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 12px' }}>Nueva disponibilidad</h3>
            <form onSubmit={onCreate}>
              <TextInput label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              <TextInput label="Hora inicio" type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} required />
              <TextInput label="Hora fin" type="time" value={fin} onChange={(e) => setFin(e.target.value)} required />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <label style={{ fontSize: 14 }}>Estado</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                  <option value="disponible">Disponible</option>
                  <option value="ocupado">Ocupado</option>
                </select>
              </div>
              <div className="auth-actions">
                <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Crear'}</Button>
              </div>
            </form>
            {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 12px' }}>Listado</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {items.map((d) => {
                const id = d.id_disponibilidad
                const isEdit = editId === id
                return (
                  <div key={id} style={{ background: '#f5f5f5', borderRadius: 12, padding: 12 }}>
                    {!isEdit ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{d.fecha}</strong> <span style={{ color: '#6b7280' }}>{d.hora_inicio}–{d.hora_fin}</span>
                          <div style={{ color: '#374151' }}>Estado: {d.estado ?? 'disponible'}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button onClick={() => { setEditId(id); setEditFecha(d.fecha); setEditInicio(d.hora_inicio); setEditFin(d.hora_fin); setEditEstado(d.estado ?? 'disponible') }}>Editar</Button>
                          <Button onClick={() => onDelete(id)}>Eliminar</Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <TextInput label="Fecha" type="date" value={editFecha} onChange={(e) => setEditFecha(e.target.value)} />
                        <TextInput label="Hora inicio" type="time" value={editInicio} onChange={(e) => setEditInicio(e.target.value)} />
                        <TextInput label="Hora fin" type="time" value={editFin} onChange={(e) => setEditFin(e.target.value)} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                          <label style={{ fontSize: 14 }}>Estado</label>
                          <select value={editEstado} onChange={(e) => setEditEstado(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                            <option value="disponible">Disponible</option>
                            <option value="ocupado">Ocupado</option>
                          </select>
                        </div>
                        <div className="auth-actions">
                          <Button onClick={() => onSave(id)} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
                          <Button onClick={() => setEditId(null)} variant="secondary">Cancelar</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
