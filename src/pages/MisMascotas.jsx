import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'
import { listarMascotas } from '../lib/api/adopcion'
import { getUser } from '../lib/api/http'

export default function MisMascotas() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    listarMascotas()
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        const u = getUser()
        const uid = (u?.id ?? u?.id_usuario)
        const mine = list.filter((m) => {
          const ownerKeys = ['id_cliente', 'id_dueno', 'id_dueño', 'cliente_id', 'usuario_id']
          return ownerKeys.some((k) => m && m[k] === uid)
        })
        setItems(mine.length > 0 ? mine : list)
      })
      .catch(() => setError('No se pudieron cargar tus mascotas'))
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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Mis mascotas</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>
              Mascotas registradas en tu perfil
            </p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px', minHeight: '60vh' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          maxWidth: 1100,
          margin: '0 auto'
        }}>
          {items.map((m, i) => (
            <article key={(m && (m.id ?? m.id_mascota)) ?? i} style={{
              background: '#f5f5f5',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
            }}>
              <h3 style={{ margin: '4px 0 10px', fontSize: 20 }}>{(m && m.nombre) ?? 'Mascota'}</h3>
              <p style={{ margin: '6px 0' }}><strong>Especie:</strong> {(m && m.especie) ?? 'Desconocida'}</p>
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => { window.location.hash = 'solicitud-adopcion' }}>Ver detalles</Button>
              </div>
            </article>
          ))}
        </div>
        {error ? <p className="auth-feedback" style={{ color: 'crimson', textAlign: 'center' }}>{error}</p> : null}
      </section>
    </div>
  )
}
