import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'

export default function Inicio() {
  return (
    <div>
      <Header />
      <Hero full>
        <div style={{ width: '100%', maxWidth: 760 }}>
          <div style={{
            background: 'rgba(17,17,17,0.75)',
            color: '#fff',
            borderRadius: 16,
            padding: 28,
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800 }}>Cuidamos a tus mascotas como si fueran nuestras</h2>
            <p style={{ marginTop: 10, color: '#e5e7eb' }}>
              En Latidos & Patitas ofrecemos atención veterinaria y adopción responsable.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
              <a href="#citas"><Button>Agendar Cita</Button></a>
              <a href="#adopcion"><Button variant="secondary">Adoptar</Button></a>
            </div>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '28px 16px', background: '#f3f4f6' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 18px', fontSize: 22 }}>Nuestros Servicios</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { icon: '🩺', title: 'Servicios Médicos' },
              { icon: '💉', title: 'Vacunación' },
              { icon: '🐾', title: 'Adopción' },
              { icon: '✂️', title: 'Peluquería' },
            ].map((s) => (
              <div key={s.title} style={{
                background: '#e5e7eb',
                borderRadius: 18,
                padding: 18,
                boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10
              }}>
                <div style={{
                  width: 70,
                  height: 70,
                  borderRadius: 16,
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34
                }}>{s.icon}</div>
                <strong style={{ color: '#111827' }}>{s.title}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
