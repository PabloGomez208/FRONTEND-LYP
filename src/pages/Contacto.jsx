import { useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'
import { request } from '../lib/api/http'

export default function Contacto() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [asunto, setAsunto] = useState('')
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
      const body = { nombre, email, mensaje }
      if (asunto) body.asunto = asunto
      // primary endpoint
      await request('POST', '/contacto', body)
      setSuccess('Mensaje enviado, pronto nos pondremos en contacto')
      setNombre('')
      setEmail('')
      setAsunto('')
      setMensaje('')
    } catch (err) {
      // try to show validation errors from Laravel
      const details = err?.details
      if (details && details.error) {
        const parts = []
        for (const val of Object.values(details.error)) {
          if (Array.isArray(val)) parts.push(...val)
          else if (val) parts.push(String(val))
        }
        if (parts.length > 0) {
          setError(parts.join(' '))
        } else {
          setError('No se pudo enviar el mensaje')
        }
      } else {
        setError('No se pudo enviar el mensaje')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <Hero full>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="card bg-dark text-light" style={{ padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.35)', textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Contacto</h2>
            <p className="mt-1 text-light">
              Escríbenos para agendar citas, adoptar o resolver tus dudas.
            </p>
          </div>
        </div>
      </Hero>
      <section className="section section--light">
        <div className="container card" style={{ maxWidth: 820 }}>
          <h3 style={{ margin: '0 0 12px' }}>Envíanos un mensaje</h3>
          <form onSubmit={onSubmit}>
            <TextInput label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} name="nombre" required />
            <TextInput label="Correo electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" required />
            <TextInput label="Asunto" value={asunto} onChange={(e) => setAsunto(e.target.value)} name="asunto" />
            <div className="input-group">
              <label className="input-label">Mensaje</label>
              <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} name="mensaje" rows={5} className="input-field" style={{ resize: 'vertical' }} />
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
