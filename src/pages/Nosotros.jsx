import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import Button from '../Components/Button.jsx'

export default function Nosotros() {
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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Nosotros</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>
              Cuidamos de tus mascotas con dedicación y amor. Promovemos la adopción responsable.
            </p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '28px 16px', background: '#f3f4f6' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 10px' }}>Misión</h3>
            <p style={{ color: '#374151' }}>
              Brindar servicios veterinarios de calidad, impulsar el bienestar animal y conectar familias con sus futuras mascotas.
            </p>
            <h3 style={{ margin: '16px 0 10px' }}>Visión</h3>
            <p style={{ color: '#374151' }}>
              Ser un referente en atención, protección y adopción responsable en nuestra comunidad.
            </p>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 10px' }}>Nuestro equipo</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Veterinarios certificados</li>
              <li>Auxiliares y cuidadores</li>
              <li>Voluntarios apasionados</li>
            </ul>
            <div style={{ marginTop: 14 }}>
              <a href="#contacto"><Button>Contáctanos</Button></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
