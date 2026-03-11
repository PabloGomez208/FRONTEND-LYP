import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'
import { listarCitas, listarCitasPorVeterinario, cambiarEstadoCita, confirmarCita, cancelarCita } from '../lib/api/citas'
import { getUser } from '../lib/api/http'

export default function VetSolicitudes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      const u = getUser()
      const uid = (u?.id ?? u?.id_usuario)
      let list = []
      // veterinario view always uses the dedicated "pendientes" endpoint
      // which returns citas junto con cliente y disponibilidad.
      if (u?.role === 'veterinario') {
        if (!uid) {
          console.error('vet role but no id present in user object', u)
          // fall back to listing all appointments, hoping the backend will
          // filter server-side or the list isn't sensitive
          const data = await listarCitas()
          list = Array.isArray(data) ? data : []
        } else {
          list = await listarCitasPorVeterinario(uid, 'pendiente')
        }
      } else {
        const data = await listarCitas()
        list = Array.isArray(data) ? data : []
      }
      setItems(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error('failed to load vet solicitudes', err)
      setError('No se pudieron cargar las solicitudes')
    }
  }
  useEffect(() => { load() }, [])

  async function onChangeEstado(id, estado) {
    setLoading(true)
    setError('')
    try {
      const u = getUser()
      const uid = (u?.id ?? u?.id_usuario)
      if (u?.role === 'veterinario') {
        if (estado === 'aceptada' || estado === 'confirmada') {
          await confirmarCita(uid, Number(id))
        } else if (estado === 'rechazada' || estado === 'cancelada') {
          await cancelarCita(uid, Number(id))
        } else {
          await cambiarEstadoCita(Number(id), estado)
        }
      } else {
        await cambiarEstadoCita(Number(id), estado)
      }
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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Pendientes</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>Aceptar o rechazar citas pendientes</p>
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
                {/* client info if available */}
                {c.cliente || c.usuario ? (
                  <div style={{ marginTop: 6, color: '#374151' }}>
                    Cliente: {(c.cliente?.nombre ?? c.usuario?.nombre ?? c.cliente?.name ?? c.usuario?.name ?? '').trim() || '---'}
                    {((c.cliente?.email ?? c.usuario?.email) ? ` (${c.cliente?.email ?? c.usuario?.email})` : '')}
                  </div>
                ) : null}
                <div style={{ marginTop: 6, color: '#374151' }}>
                  {c.fecha ? <span>Fecha: {c.fecha} • </span> : null}
                  {c.hora ? <span>Hora: {c.hora} • </span> : null}
                  {c.estado ? <span>Estado: {c.estado}</span> : <span>Estado: pendiente</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button onClick={() => onChangeEstado(id, 'aceptada')} disabled={loading} variant="primary">Aceptar</Button>
                  <Button onClick={() => onChangeEstado(id, 'rechazada')} disabled={loading} variant="danger">Rechazar</Button>
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
