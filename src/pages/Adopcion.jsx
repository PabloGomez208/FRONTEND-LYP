import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'
import { listarMascotas } from '../lib/api/adopcion'

const mascotas = [
  {
    nombre: 'MAX',
    especie: 'Perro',
    raza: 'Labrador',
    edad: '2 años',
    descripcion: 'Max es un perro muy juguetón y cariñoso. Le encanta correr y jugar con pelotas.',
    foto: 'https://images.unsplash.com/photo-1519150268069-c094c2c0f4a0?q=80&w=800&auto=format&fit=crop'
  },
  {
    nombre: 'LUNA',
    especie: 'Gato',
    raza: 'Siamés',
    edad: '1 año',
    descripcion: 'Luna es una gata muy tranquila y cariñosa. Le gusta dormir en lugares cálidos.',
    foto: 'https://images.unsplash.com/photo-1593443320706-b57f62c3bafe?q=80&w=800&auto=format&fit=crop'
  },
  {
    nombre: 'COPITO',
    especie: 'Conejo',
    raza: 'Enano',
    edad: '1 año',
    descripcion: 'Copito es un conejo muy dócil y limpio. Es ideal para familias con niños.',
    foto: 'https://images.unsplash.com/photo-1540322530211-4775c61ab9b0?q=80&w=800&auto=format&fit=crop'
  }
]

export default function Adopcion() {
  const [items, setItems] = useState(mascotas)
  function resolveImage(src) {
    const fallback = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop'
    if (!src || typeof src !== 'string') return fallback
    // absolute urls pass-through
    if (/^https?:\/\//i.test(src)) return src
    // normalize common storage prefixes
    let path = src.replace(/^public\//, '')
    if (!path.startsWith('/')) path = '/' + path
    // prefer backend target host if provided
    const target = import.meta.env.VITE_API_TARGET || ''
    if (target) {
      const base = String(target).replace(/\/+$/, '')
      return `${base}${path}`
    }
    // as a last resort, let the dev server try to proxy static files
    return path
  }
  async function refresh() {
    try {
      const data = await listarMascotas()
      if (Array.isArray(data) && data.length > 0) {
        const available = data.filter((m) => {
          const estado = String(m?.estado ?? '').toLowerCase()
          // visible si no tiene estado, o si está disponible/activo
          if (!estado) return true
          return estado.includes('disponible') || estado.includes('activo')
        })
        const mapped = (available.length > 0 ? available : data).map((m) => {
          const nombre = m?.nombre ?? 'Mascota'
          const especie = m?.especie ?? m?.especieRef?.nombre ?? 'Desconocida'
          const raza = m?.raza ?? ''
          const edadRaw = m?.edad
          const edad = (typeof edadRaw === 'number' && Number.isFinite(edadRaw))
            ? String(edadRaw)
            : (edadRaw ?? '')
          const descripcion = m?.descripcion ?? ''
          const foto = resolveImage(m?.imagen ?? m?.foto)
          return { nombre, especie, raza, edad, descripcion, foto }
        })
        setItems(mapped)
      }
    } catch {}
  }
  useEffect(() => {
    refresh()
    function onUpdate() { refresh() }
    window.addEventListener('mascotas:updated', onUpdate)
    return () => window.removeEventListener('mascotas:updated', onUpdate)
  }, [])
  return (
    <div>
      <Header />
      <Hero full>
        <div style={{
          width: '100%',
          maxWidth: 720,
          background: 'rgba(255,255,255,0.9)',
          color: '#111827',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Adopción</h2>
          <p style={{ marginTop: 8 }}>Encuentra a tu compañero perfecto</p>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px', minHeight: '100vh' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          maxWidth: 1100,
          margin: '0 auto'
        }}>
          {items.map((m) => (
            <article key={m.nombre} style={{
              background: '#f5f5f5',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
            }}>
              <h3 style={{ margin: '4px 0 10px', fontSize: 20, color: '#111827' }}>{m.nombre}</h3>
              <div style={{
                width: '100%',
                aspectRatio: '16/10',
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 12
              }}>
                <img src={m.foto} alt={m.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop' }} />
              </div>
              <p style={{ margin: '6px 0', color: '#111827' }}><strong style={{ color: '#111827' }}>Especie:</strong> {m.especie || '—'}</p>
              <p style={{ margin: '6px 0', color: '#111827' }}><strong style={{ color: '#111827' }}>Raza:</strong> {m.raza || '—'}</p>
              <p style={{ margin: '6px 0', color: '#111827' }}><strong style={{ color: '#111827' }}>Edad:</strong> {m.edad || '—'}</p>
              <p style={{ marginTop: 8, color: '#111827' }}>{m.descripcion || ''}</p>
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => {
                  try {
                    localStorage.setItem('selected_mascota_nombre', m.nombre)
                    localStorage.setItem('selected_mascota_especie', m.especie)
                  } catch (e) { void e }
                  {
                    const q = new URLSearchParams()
                    q.set('mascota', m.nombre || '')
                    if (m.especie) q.set('especie', m.especie)
                    window.location.hash = 'solicitud-adopcion?' + q.toString()
                  }
                }}>Adoptar</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
