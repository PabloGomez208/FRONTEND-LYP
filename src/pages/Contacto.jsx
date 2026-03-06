import { useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'

export default function Contacto() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      setSuccess('Mensaje enviado correctamente')
      setNombre('')
      setEmail('')
      setMensaje('')
    } catch {
      setError('No se pudo enviar el mensaje')
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
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Contacto</h2>
            <p style={{ marginTop: 8, color: '#e5e7eb' }}>
              Escríbenos para agendar citas, adoptar o resolver tus dudas.
            </p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '28px 16px', background: '#f3f4f6' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
          <h3 style={{ margin: '0 0 12px' }}>Envíanos un mensaje</h3>
          <form onSubmit={onSubmit}>
            <TextInput label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} name="nombre" required />
            <TextInput label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 14 }}>Mensaje</label>
              <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} name="mensaje" rows={5} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', resize: 'vertical' }} />
            </div>
            <div className="auth-actions">
              <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</Button>
            </div>
          </form>
          {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          {success ? <p className="auth-feedback" style={{ color: 'seagreen' }}>{success}</p> : null}
        </div>
      </section>
    </div>
  )
}
