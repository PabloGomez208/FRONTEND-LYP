import { useEffect, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'
import { listarMascotas, crearSolicitudAdopcion, adoptarMascota } from '../lib/api/adopcion'
import { getUser } from '../lib/api/http'

export default function SolicitudAdopcion() {
  const [mascotas, setMascotas] = useState([])
  const [idMascota, setIdMascota] = useState('')
  // fecha_solicitud is assigned by server, no need to track on client
  const [motivo, setMotivo] = useState('')
  const [direccion, setDireccion] = useState('')
  const [tieneMascotas, setTieneMascotas] = useState(false)
  const [experiencia, setExperiencia] = useState('')
  const [tipoMascota, setTipoMascota] = useState('Perro')
  const user = getUser()
  const isClient = (user?.role ?? '').toLowerCase() === 'cliente'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [presetName, setPresetName] = useState('')

  useEffect(() => {
    listarMascotas()
      .then((data) => setMascotas(Array.isArray(data) ? data : []))
      .catch(() => setError('No se pudo cargar mascotas'))
  }, [])

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const q = hash.includes('?') ? hash.split('?')[1] : ''
    const params = new URLSearchParams(q)
    const fromUrl = params.get('mascota') || ''
    const especieParam = params.get('especie') || ''
    let fromStorage = ''
    try {
      fromStorage = localStorage.getItem('selected_mascota_nombre') || ''
      const especie = localStorage.getItem('selected_mascota_especie') || ''
      if (especieParam) setTipoMascota(especieParam)
      else if (especie) setTipoMascota(especie)
    } catch (e) { void e }
    setPresetName(fromUrl || fromStorage)
  }, [])

  useEffect(() => {
    if (!presetName || !Array.isArray(mascotas) || mascotas.length === 0) return
    const match = mascotas.find((m) => {
      const name = (m.nombre ?? '').toLowerCase()
      return name === presetName.toLowerCase()
    })
    if (match) {
      const id = match.id ?? match.id_mascota
      if (id) setIdMascota(String(id))
    }
  }, [presetName, mascotas])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!getUser()) {
      setError('Debes iniciar sesión para solicitar adopción')
      return
    }
    if (!idMascota) {
      setError('Selecciona una mascota')
      return
    }
    setLoading(true)
    try {
      // prefer the new adoptar endpoint; fallback happens inside the helper
      const result = await adoptarMascota(Number(idMascota), {
        motivo,
        direccion,
        tiene_mascotas: tieneMascotas,
        experiencia,
      })
      let msg = 'Solicitud enviada correctamente'
      if (result?.fecha_solicitud) {
        msg += ` (fecha: ${result.fecha_solicitud})`
      }
      setSuccess(msg)
      setIdMascota('')
      setMotivo('')
      setDireccion('')
      setTieneMascotas(false)
      setExperiencia('')
    } catch (err) {
      setError(typeof err?.message === 'string' ? err.message : 'Error al enviar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <Hero full>
        <div style={{ width: '100%', maxWidth: 1000 }}>
          <div style={{
            background: 'rgba(17,17,17,0.75)',
            color: '#fff',
            borderRadius: 16,
            padding: 18,
            textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Adopción</h2>
            <p style={{ marginTop: 6, color: '#e5e7eb' }}>Completa el formulario para solicitar adopción.</p>
          </div>
        </div>
      </Hero>
      <section style={{ padding: '24px 16px', background: '#f3f4f6' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
          <h3 style={{ margin: '0 0 12px' }}>Solicitud de adopción</h3>
          <form onSubmit={onSubmit}>
            {!isClient && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <label style={{ fontSize: 14 }}>Tipo de mascota</label>
                <select
                  value={tipoMascota}
                  onChange={(e) => setTipoMascota(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
                >
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Otro</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 14 }}>Mascota</label>
              <select
                value={idMascota}
                onChange={(e) => setIdMascota(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
                required
              >
                <option value="">Selecciona una mascota</option>
                {mascotas
                  .filter((m) => !tipoMascota || (m.especie ?? '').toLowerCase() === tipoMascota.toLowerCase())
                  .map((m) => {
                    const id = m.id ?? m.id_mascota
                    const name = m.nombre ?? 'Mascota'
                    const especie = m.especie ?? ''
                    return <option key={id ?? name} value={id ?? ''}>{name} {especie ? `• ${especie}` : ''}</option>
                  })}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 14 }}>Motivo</label>
              <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} name="motivo" rows={4} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', resize: 'vertical' }} />
            </div>
            <TextInput label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} name="direccion" placeholder="Calle #, Ciudad" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <input id="tieneMascotas" type="checkbox" checked={tieneMascotas} onChange={(e) => setTieneMascotas(e.target.checked)} />
              <label htmlFor="tieneMascotas" style={{ fontSize: 14 }}>¿Tienes otras mascotas?</label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <label style={{ fontSize: 14 }}>Experiencia</label>
              <textarea value={experiencia} onChange={(e) => setExperiencia(e.target.value)} name="experiencia" rows={4} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', resize: 'vertical' }} />
            </div>
            <div className="auth-actions">
              <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Solicitar adopción'}</Button>
            </div>
          </form>
          {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          {success ? <p className="auth-feedback" style={{ color: 'seagreen' }}>{success}</p> : null}
        </div>
      </section>
    </div>
  )
}
