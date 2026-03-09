import { useEffect, useRef, useState } from 'react'
import { getToken, getUser } from '../lib/api/http'
import { logout } from '../lib/api/auth'

export default function AuthButtons() {
  const [authed, setAuthed] = useState(!!getToken())
  const [userName, setUserName] = useState(getUser()?.name ?? '')
  const [role, setRole] = useState(getUser()?.role ?? '')
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const i = setInterval(() => {
      setAuthed(!!getToken())
      setUserName(getUser()?.name ?? '')
      setRole(getUser()?.role ?? '')
    }, 500)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  if (!authed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="#registro" className="btn btn-secondary" style={{ borderRadius: 999 }}>Registrarme</a>
        <a href="#login" className="btn" style={{ background: '#f59e0b', color: '#0f0f0f', borderRadius: 999 }}>Iniciar Sesión</a>
      </div>
    )
  }

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: '#1f2937',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 999,
          border: '1px solid #374151',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <span>{userName || 'Perfil'}</span>
        <span>▾</span>
      </button>
      {open ? (
        <div style={{
          position: 'absolute',
          right: 0,
          marginTop: 8,
          background: '#111827',
          color: '#fff',
          borderRadius: 12,
          minWidth: 220,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          overflow: 'hidden',
          border: '1px solid #1f2937',
          zIndex: 50
        }}>
          {role === 'admin' ? (
            <div>
              <div style={{ padding: '8px 12px', fontSize: 12, color: '#9ca3af' }}>Administración</div>
              <a href="#admin-usuarios" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Usuarios</a>
              <a href="#admin-citas" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Citas</a>
              <a href="#admin-mascotas" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Mascotas</a>
              <a href="#admin-mensajes" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Mensajes</a>
              <a href="#admin-solicitudes" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Solicitudes</a>
              <div style={{ height: 1, background: '#1f2937' }} />
            </div>
          ) : null}
          {role === 'veterinario' ? (
            <div>
              <div style={{ padding: '8px 12px', fontSize: 12, color: '#9ca3af' }}>Veterinario</div>
              <a href="#vet-disponibilidad" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Disponibilidad</a>
              <a href="#mis-citas" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Mis citas</a>
              <a href="#vet-solicitudes" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Pendientes</a>
              <div style={{ height: 1, background: '#1f2937' }} />
            </div>
          ) : null}
          <a href="#mis-mascotas" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Mascotas en posesión</a>
          <a href="#mis-citas" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Citas pedidas</a>
          <a href="#editar-perfil" className="text-light" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none' }} onClick={() => setOpen(false)}>Editar perfil</a>
          <button
            onClick={async () => {
              try {
                await logout()
              } catch {}
              setAuthed(false)
              setOpen(false)
              window.location.hash = 'inicio'
            }}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', background: '#ef4444', border: 'none', color: '#fff' }}
          >
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  )
}
