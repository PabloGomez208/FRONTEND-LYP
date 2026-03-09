import { useEffect, useState } from 'react'
import AuthButtons from './AuthButtons.jsx'
import { getUser } from '../lib/api/http'

export default function Header() {
  const [role, setRole] = useState(getUser()?.role ?? '')
  useEffect(() => {
    const i = setInterval(() => setRole(getUser()?.role ?? ''), 500)
    return () => clearInterval(i)
  }, [])
  return (
    <header className="bg-dark text-light" style={{ padding: '12px 20px' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="logo">🐾</span>
          <strong>Latidos & Patitas</strong>
        </div>
        <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {role === 'admin' ? (
            <>
              <a href="#admin-usuarios" className="text-light">Usuarios</a>
              <a href="#admin-citas" className="text-light">Citas</a>
              <a href="#admin-mascotas" className="text-light">Mascotas</a>
              <a href="#admin-solicitudes" className="text-light">Solicitudes</a>
              <a href="#admin-mensajes" className="text-light">Mensajes</a>
            </>
          ) : role === 'veterinario' ? (
            <>
              <a href="#vet-disponibilidad" className="text-light">Disponibilidad</a>
              <a href="#mis-citas" className="text-light">Mis citas</a>
              <a href="#vet-solicitudes" className="text-light">Pendientes</a>
            </>
          ) : (
            <>
              <a href="#inicio" className="text-light">Inicio</a>
              <a href="#adopcion" className="text-light">Adopción</a>
              <a href="#citas" className="text-light">Citas</a>
              <a href="#nosotros" className="text-light">Nosotros</a>
              <a href="#contacto" className="text-light">Contacto</a>
            </>
          )}
          <div style={{ marginLeft: 8 }}>
            <AuthButtons />
          </div>
        </nav>
      </div>
    </header>
  )
}
