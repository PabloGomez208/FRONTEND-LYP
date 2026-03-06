import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'
import { getUser } from '../lib/api/http'
import { updateProfile } from '../lib/api/auth'

export default function EditarPerfil() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const u = getUser()
    setName(u?.name ?? '')
    setEmail(u?.email ?? '')
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await updateProfile({ name, email, telefono, password: password || undefined })
      setSuccess('Perfil actualizado')
      setPassword('')
    } catch {
      setError('No se pudo actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Editar perfil</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>
              Actualiza tu información
            </p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '28px 16px', background: '#f3f4f6' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
          <h3 style={{ margin: '0 0 12px' }}>Datos de usuario</h3>
          <form onSubmit={onSubmit}>
            <TextInput label="Nombre" value={name} onChange={(e) => setName(e.target.value)} name="name" required />
            <TextInput label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" required />
            <TextInput label="Teléfono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} name="telefono" />
            <TextInput label="Contraseña nueva" type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Opcional" />
            <div className="auth-actions">
              <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar cambios'}</Button>
            </div>
          </form>
          {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          {success ? <p className="auth-feedback" style={{ color: 'seagreen' }}>{success}</p> : null}
        </div>
      </section>
    </div>
  )
}
