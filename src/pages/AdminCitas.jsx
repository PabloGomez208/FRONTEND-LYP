import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'
import { listarCitasAdmin, eliminarCita, cambiarEstadoCita } from '../lib/api/citas'

export default function AdminCitas() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      const data = await listarCitasAdmin()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudieron cargar las citas')
    }
  }
  useEffect(() => { load() }, [])

  async function onDelete(id) {
    setLoading(true)
    setError('')
    try {
      await eliminarCita(Number(id))
      await load()
    } catch {
      setError('No se pudo eliminar la cita')
    } finally { setLoading(false) }
  }

  async function onChangeEstado(id, estado) {
    setLoading(true)
    setError('')
    try {
      await cambiarEstadoCita(Number(id), estado)
      await load()
    } catch {
      setError('No se pudo actualizar el estado')
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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Citas</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>Administra citas</p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 12 }}>
          {items.map((c, i) => {
            const id = c.id ?? c.id_cita ?? i
            return (
              <div key={id} style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
                <strong>{c.motivo || 'Sin motivo'}</strong>
                <div style={{ marginTop: 6, color: '#374151' }}>
                  {c.fecha ? <span>Fecha: {c.fecha} • </span> : null}
                  {c.hora ? <span>Hora: {c.hora} • </span> : null}
                  {c.estado ? <span>Estado: {c.estado}</span> : null}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <select
                    value={c.estado ?? 'pendiente'}
                    onChange={(e) => onChangeEstado(id, e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                  <Button onClick={() => onDelete(id)} disabled={loading}>Eliminar</Button>
                </div>
              </div>
            )
          })}
          {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
        </div>
      </section>
    </div>
  )
}
