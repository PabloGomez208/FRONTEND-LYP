import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'
import { listarSolicitudesPendientes, cambiarEstadoSolicitud } from '../lib/api/adopcion'

export default function AdminSolicitudes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      const data = await listarSolicitudesPendientes()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudieron cargar las solicitudes')
    }
  }

  useEffect(() => { load() }, [])

  async function onDecide(id, estado) {
    setLoading(true)
    setError('')
    try {
      await cambiarEstadoSolicitud(Number(id), estado)
      await load()
      // notify other components (mascotas list) that data may have changed
      window.dispatchEvent(new Event('mascotas:updated'))
    } catch {
      setError('No se pudo actualizar el estado')
    } finally {
      setLoading(false)
    }
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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Solicitudes</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>Revisa las solicitudes de adopción pendientes</p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 12 }}>
          {items.map((s, i) => {
            const id = s.id ?? i
            const cliente = s.cliente || s.usuario || {}
            const mascota = s.mascota || {}
            return (
              <div key={id} style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
                <div><strong>Solicitud #{id}</strong></div>
                <div style={{ marginTop: 6, color: '#374151' }}>
                  Cliente: {cliente.nombre ?? cliente.name ?? '---'} ({cliente.email ?? ''})
                </div>
                <div style={{ marginTop: 6, color: '#374151' }}>
                  Mascota: {mascota.nombre ?? '---'} {mascota.especie ? `• ${mascota.especie}` : ''}
                </div>
                <div style={{ marginTop: 6, color: '#374151' }}>
                  Motivo: {s.motivo || 'Sin motivo'}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button onClick={() => onDecide(id, 'aceptada')} disabled={loading}>Aceptar</Button>
                  <Button onClick={() => onDecide(id, 'rechazada')} disabled={loading}>Rechazar</Button>
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
