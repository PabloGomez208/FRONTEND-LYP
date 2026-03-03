import { useEffect, useState } from 'react'
import { getToken, getUser } from '../lib/api/http'
import { logout } from '../lib/api/auth'

export default function AuthButtons() {
  const [authed, setAuthed] = useState(!!getToken())
  const [userName, setUserName] = useState(getUser()?.name ?? '')

  useEffect(() => {
    const i = setInterval(() => {
      setAuthed(!!getToken())
      setUserName(getUser()?.name ?? '')
    }, 500)
    return () => clearInterval(i)
  }, [])

  if (!authed) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="#registro" style={{
          background: '#fff',
          color: '#0f0f0f',
          padding: '8px 12px',
          borderRadius: 999,
          border: '1px solid #e5e7eb'
        }}>Registrarme</a>
        <a href="#login" style={{
          background: '#f59e0b',
          color: '#0f0f0f',
          padding: '8px 12px',
          borderRadius: 999
        }}>Iniciar Sesión</a>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: '#fff' }}>Hola, {userName || 'usuario'}</span>
      <button
        onClick={() => {
          logout()
          setAuthed(false)
          window.location.hash = 'inicio'
        }}
        style={{
          background: '#ef4444',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 999,
          border: 'none'
        }}
      >
        Cerrar sesión
      </button>
    </div>
  )
}
