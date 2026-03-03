import AuthButtons from './AuthButtons.jsx'

export default function Header() {
  return (
    <header style={{
      width: '100%',
      backgroundColor: '#0f0f0f',
      color: '#fff',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          display: 'inline-flex',
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: '#f59e0b',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          color: '#0f0f0f'
        }}>🐾</span>
        <strong>Latidos & Patitas</strong>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="#inicio" style={{ color: '#fff' }}>Inicio</a>
        <a href="#adopcion" style={{ color: '#fff' }}>Adopción</a>
        <a href="#citas" style={{ color: '#fff' }}>Citas</a>
        <a href="#nosotros" style={{ color: '#fff' }}>Nosotros</a>
        <a href="#contacto" style={{ color: '#fff' }}>Contacto</a>
        <div style={{ marginLeft: 8 }}>
          <AuthButtons />
        </div>
      </nav>
    </header>
  )
}
