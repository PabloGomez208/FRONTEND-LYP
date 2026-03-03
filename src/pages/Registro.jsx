import { useState } from 'react'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'
import { register } from '../lib/api/auth'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import '../styles/auth.css'

export default function Registro() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [phone, setPhone] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== password2) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const user = await register({ name, email, password, password_confirmation: password2, telefono: phone })
      setSuccess(user ? 'Registro exitoso' : 'Registro completado')
      if (user) {
        window.location.hash = 'inicio'
      }
    } catch (err) {
      setError(typeof err?.message === 'string' ? err.message : 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <Hero full>
        <div className="auth-card">
          <h2 className="auth-title">Crear cuenta</h2>
          <form onSubmit={handleSubmit}>
            <TextInput
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              name="name"
              required
            />
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
              label="Teléfono"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="3001234567"
              name="telefono"
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
            <TextInput
              label="Confirmar contraseña"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="••••••••"
              name="password_confirmation"
              required
            />
            <div className="auth-actions">
              <Button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Registrarse'}</Button>
            </div>
          </form>
          {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          {success ? <p className="auth-feedback" style={{ color: 'seagreen' }}>{success}</p> : null}
        </div>
      </Hero>
    </div>
  )
}
