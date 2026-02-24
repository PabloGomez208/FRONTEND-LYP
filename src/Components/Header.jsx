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
      <nav style={{ display: 'flex', gap: 16 }}>
        <a href="#" style={{ color: '#fff' }}>Inicio</a>
        <a href="#" style={{ color: '#fff' }}>Adopción</a>
        <a href="#" style={{ color: '#fff' }}>Servicios</a>
      </nav>
    </header>
  )
}
