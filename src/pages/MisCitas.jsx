import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import { listarCitas } from '../lib/api/citas'
import { getUser } from '../lib/api/http'

export default function MisCitas() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    listarCitas()
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        const u = getUser()
        const uid = (u?.id ?? u?.id_usuario)
        const mine = list.filter((c) => c && c.id_cliente === uid)
        setItems(mine.length > 0 ? mine : list)
      })
      .catch(() => setError('No se pudieron cargar tus citas'))
  }, [])

  return (
    <div>
      <Header />
      <Hero full>
        <div style={{ width: '100%', maxWidth: 820 }}>
          <div style={{
            background: 'rgba(17,17,17,0.75)',
            color: '#fff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Mis citas</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>
              Historial y próximas citas
            </p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {items.map((c, i) => (
            <div key={(c && c.id) ?? i} style={{ background: '#f5f5f5', borderRadius: 12, padding: 12 }}>
              <strong>{(c && c.motivo) || 'Sin motivo'}</strong>
              {c && c.fecha ? <div style={{ marginTop: 6, color: '#374151' }}>Fecha: {c.fecha}</div> : null}
              {c && c.hora ? <div style={{ marginTop: 4, color: '#374151' }}>Hora: {c.hora}</div> : null}
            </div>
          ))}
        </div>
        {error ? <p className="auth-feedback" style={{ color: 'crimson', textAlign: 'center' }}>{error}</p> : null}
      </section>
    </div>
  )
}
