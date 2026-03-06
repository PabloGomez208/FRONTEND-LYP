import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'
import { listarCitas, cambiarEstadoCita } from '../lib/api/citas'

export default function VetSolicitudes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      const data = await listarCitas()
      const list = Array.isArray(data) ? data : []
      const pending = list.filter((c) => (c && (c.estado ?? '').toLowerCase()) === 'pendiente')
      setItems(pending.length > 0 ? pending : list)
    } catch {
      setError('No se pudieron cargar las solicitudes')
    }
  }
  useEffect(() => { load() }, [])

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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Solicitudes de cita</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>Aceptar o rechazar solicitudes</p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 12 }}>
          {items.map((c, i) => {
            const id = c.id ?? i
            return (
              <div key={id} style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
                <strong>{c.motivo || 'Sin motivo'}</strong>
                <div style={{ marginTop: 6, color: '#374151' }}>
                  {c.fecha ? <span>Fecha: {c.fecha} • </span> : null}
                  {c.hora ? <span>Hora: {c.hora} • </span> : null}
                  {c.estado ? <span>Estado: {c.estado}</span> : <span>Estado: pendiente</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button onClick={() => onChangeEstado(id, 'aceptada')} disabled={loading}>Aceptar</Button>
                  <Button onClick={() => onChangeEstado(id, 'rechazada')} disabled={loading}>Rechazar</Button>
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
