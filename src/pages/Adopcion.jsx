import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'

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
          {mascotas.map((m) => (
            <article key={m.nombre} style={{
              background: '#f5f5f5',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
            }}>
              <h3 style={{ margin: '4px 0 10px', fontSize: 20 }}>{m.nombre}</h3>
              <div style={{
                width: '100%',
                aspectRatio: '16/10',
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 12
              }}>
                <img src={m.foto} alt={m.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <p style={{ margin: '6px 0' }}><strong>Especie:</strong> {m.especie}</p>
              <p style={{ margin: '6px 0' }}><strong>Raza:</strong> {m.raza}</p>
              <p style={{ margin: '6px 0' }}><strong>Edad:</strong> {m.edad}</p>
              <p style={{ marginTop: 8 }}>{m.descripcion}</p>
              <div style={{ marginTop: 12 }}>
                <Button onClick={() => {
                  try {
                    localStorage.setItem('selected_mascota_nombre', m.nombre)
                    localStorage.setItem('selected_mascota_especie', m.especie)
                  } catch (e) { void e }
                  window.location.hash = 'solicitud-adopcion?mascota=' + encodeURIComponent(m.nombre)
                }}>Adoptar</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
