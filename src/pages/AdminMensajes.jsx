import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'
import { request } from '../lib/api/http'

export default function AdminMensajes() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    setLoading(true)
    try {
      let data = []
      try {
        data = await request('GET', '/mensajes-contacto', undefined, { auth: true })
      } catch (err) {
        try {
          data = await request('GET', '/contact/messages', undefined, { auth: true })
        } catch {
          data = []
        }
      }
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudieron cargar los mensajes')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Mensajes</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>Bandeja de mensajes de contacto</p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Total: {items.length}</strong>
            <Button onClick={load} disabled={loading}>{loading ? 'Cargando...' : 'Actualizar'}</Button>
          </div>
          {items.map((m, i) => (
            <div key={m.id ?? i} style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
              <div style={{ fontWeight: 700 }}>{m.nombre ?? m.name ?? 'Desconocido'}</div>
              <div style={{ color: '#374151' }}>{m.email ?? ''}</div>
              <div style={{ marginTop: 8 }}>{m.mensaje ?? m.message ?? ''}</div>
              {m.created_at ? <div style={{ marginTop: 6, color: '#6b7280' }}>{m.created_at}</div> : null}
            </div>
          ))}
          {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          {items.length === 0 && !loading && !error ? <p style={{ color: '#6b7280' }}>Sin mensajes por ahora</p> : null}
        </div>
      </section>
    </div>
  )
}
