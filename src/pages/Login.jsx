import { useState } from 'react'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'
import { login } from '../lib/api/auth'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import '../styles/auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const user = await login({ email, password })
      setSuccess(user ? 'Inicio de sesión exitoso' : 'Inicio de sesión completado')
      if (user) {
        window.location.hash = 'inicio'
      }
    } catch (err) {
      setError(typeof err?.message === 'string' ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <Hero full>
        <div className="auth-card">
          <h2 className="auth-title">Iniciar sesión</h2>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@dominio.com"
              name="email"
              required
            />
            <TextInput
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              name="password"
              required
            />
            <div className="auth-actions">
              <Button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</Button>
            </div>
          </form>
          {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          {success ? <p className="auth-feedback" style={{ color: 'seagreen' }}>{success}</p> : null}
        </div>
      </Hero>
    </div>
  )
}
