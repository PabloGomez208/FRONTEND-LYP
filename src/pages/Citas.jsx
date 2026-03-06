import { useEffect, useMemo, useState } from 'react'
import Header from '../Components/Header.jsx'
import Hero from '../Components/Hero.jsx'
import TextInput from '../Components/TextInput.jsx'
import Button from '../Components/Button.jsx'
import { crearCita, listarCitas, listarDisponibilidad, eliminarCita, cambiarEstadoCita, listarCitasAdmin, listarCitasActivasAdmin } from '../lib/api/citas'
import { getUser } from '../lib/api/http'

export default function Citas() {
  const [nombre, setNombre] = useState('')
  const [tipoMascota, setTipoMascota] = useState('Perro')
  const [tipoServicio, setTipoServicio] = useState('Consulta general')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [idDisp, setIdDisp] = useState('')
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [citas, setCitas] = useState([])
  const [allSlots, setAllSlots] = useState([])
  const [adminLoading, setAdminLoading] = useState(false)
  const [activosList, setActivosList] = useState([])
  const u = typeof window !== 'undefined' ? getUser() : null
  const adminMode = (u?.role ?? '').toLowerCase() === 'admin'

  async function cargarCitas() {
    try {
      const data = await listarCitas()
      setCitas(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudo cargar citas')
    }
  }

  async function cargarDisponibilidad() {
    try {
      const data = await listarDisponibilidad('disponible')
      setSlots(Array.isArray(data) ? data : [])
    } catch {
      setError('No se pudo cargar disponibilidad')
    }
  }

  async function cargarAdminData() {
    setAdminLoading(true)
    try {
      const [c, d] = await Promise.all([
        listarCitasAdmin().catch(() => []),
        listarDisponibilidad().catch(() => []),
      ])
      setCitas(Array.isArray(c) ? c : [])
      setAllSlots(Array.isArray(d) ? d : [])
      try {
        const a = await listarCitasActivasAdmin()
        setActivosList(Array.isArray(a) ? a : [])
      } catch {
        setActivosList([])
      }
    } catch {
      setError('No se pudieron cargar datos de citas')
    } finally {
      setAdminLoading(false)
    }
  }

  useEffect(() => {
    if (adminMode) {
      cargarAdminData()
    }
  }, [adminMode])

  const activos = useMemo(() => {
    if (Array.isArray(activosList) && activosList.length > 0) {
      return activosList
    }
    if (!Array.isArray(citas) || citas.length === 0) return []
    const now = new Date()
    function parseSlot(c) {
      if (c?.fecha && c?.hora) {
        return { fecha: c.fecha, inicio: c.hora, fin: c.hora }
      }
      const idd = c?.id_disponibilidad
      const s = Array.isArray(allSlots) ? allSlots.find((x) => x.id_disponibilidad === idd) : null
      if (!s) return null
      return { fecha: s.fecha, inicio: s.hora_inicio, fin: s.hora_fin }
    }
    function isNow(fecha, hIni, hFin) {
      if (!fecha || !hIni) return false
      const [Y, M, D] = fecha.split('-').map((n) => Number(n))
      const [h1, m1] = String(hIni).split(':').map((n) => Number(n))
      const [h2, m2] = String(hFin || hIni).split(':').map((n) => Number(n))
      const start = new Date(Y, (M - 1), D, h1, m1, 0)
      const end = new Date(Y, (M - 1), D, h2, m2, 0)
      return now >= start && now <= end
    }
    return citas.filter((c) => {
      const estado = (c?.estado ?? '').toLowerCase()
      if (estado === 'rechazada') return false
      const slot = parseSlot(c)
      if (!slot) return estado === 'aceptada'
      return isNow(slot.fecha, slot.inicio, slot.fin) || estado === 'aceptada'
    })
  }, [citas, allSlots])

  async function adminEliminar(id) {
    setAdminLoading(true)
    setError('')
    try {
      await eliminarCita(Number(id))
      await cargarAdminData()
    } catch {
      setError('No se pudo eliminar la cita')
    } finally {
      setAdminLoading(false)
    }
  }

  async function adminEstado(id, estado) {
    setAdminLoading(true)
    setError('')
    try {
      await cambiarEstadoCita(Number(id), estado)
      await cargarAdminData()
    } catch {
      setError('No se pudo actualizar el estado')
    } finally {
      setAdminLoading(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const motivo = `Nombre: ${nombre}; Mascota: ${tipoMascota}; Servicio: ${tipoServicio}; Fecha: ${fecha}; Hora: ${hora}`
      await crearCita({ motivo, id_disponibilidad: idDisp ? Number(idDisp) : undefined })
      setSuccess('Cita creada correctamente')
      setNombre('')
      setTipoMascota('Perro')
      setTipoServicio('Consulta general')
      setFecha('')
      setHora('')
      setIdDisp('')
      await cargarCitas()
    } catch (err) {
      setError(typeof err?.message === 'string' ? err.message : 'Error al crear la cita')
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
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Citas</h2>
            <p style={{ marginTop: 6, color: '#e5e7eb' }}>Atención veterinaria de calidad para tu mascota.</p>
          </div>
        </div>
      </Hero>
      {adminMode ? (
        <section style={{ padding: '24px 16px', background: '#fff' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h3 style={{ margin: '0 0 12px' }}>Citas activas ahora</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              {activos.map((c, i) => {
                const id = c.id ?? c.id_cita ?? i
                return (
                  <div key={id} style={{ background: '#f5f5f5', borderRadius: 12, padding: 12 }}>
                    <strong>{c.motivo || 'Sin motivo'}</strong>
                    <div style={{ marginTop: 6, color: '#374151' }}>
                      {c.fecha ? <div>Fecha: {c.fecha}</div> : null}
                      {c.hora ? <div>Hora: {c.hora}</div> : null}
                      {c.estado ? <div>Estado: {c.estado}</div> : null}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <select
                        defaultValue={c.estado ?? 'pendiente'}
                        onChange={(e) => adminEstado(id, e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc' }}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                      <Button onClick={() => adminEliminar(id)} disabled={adminLoading}>Eliminar</Button>
                    </div>
                  </div>
                )
              })}
            </div>
            {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
          </div>
        </section>
      ) : null}
      <section style={{ padding: '24px 16px', background: '#f3f4f6' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 10px' }}>Información de Citas</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Consulta general</li>
              <li>Vacunación</li>
              <li>Desparasitación</li>
              <li>Peluquería</li>
              <li>Urgencias</li>
            </ul>
            <h4 style={{ margin: '16px 0 8px' }}>Horario de Atención</h4>
            <div style={{ color: '#374151' }}>
              <div>Lunes a Viernes: 8:00 AM - 7:00 PM</div>
              <div>Sábados: 9:00 AM - 5:00 PM</div>
              <div>Domingos: 10:00 AM - 2:00 PM (Solo emergencias)</div>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
            <h3 style={{ margin: '0 0 12px' }}>Agenda tu cita</h3>
            <form onSubmit={onSubmit}>
              <TextInput label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} name="nombre" required />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <label style={{ fontSize: 14 }}>Tipo de mascota</label>
                <select value={tipoMascota} onChange={(e) => setTipoMascota(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Otro</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <label style={{ fontSize: 14 }}>Tipo de servicio</label>
                <select value={tipoServicio} onChange={(e) => setTipoServicio(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
                  <option>Consulta general</option>
                  <option>Vacunación</option>
                  <option>Desparasitación</option>
                  <option>Peluquería</option>
                  <option>Urgencias</option>
                </select>
              </div>
              <TextInput label="Fecha de la cita" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} name="fecha" required />
              <TextInput label="Hora de la cita" type="time" value={hora} onChange={(e) => setHora(e.target.value)} name="hora" required />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                <label style={{ fontSize: 14 }}>Disponibilidad</label>
                <select
                  value={idDisp}
                  onChange={(e) => setIdDisp(e.target.value)}
                  onFocus={() => slots.length === 0 ? cargarDisponibilidad() : null}
                  style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
                  required
                >
                  <option value="">Selecciona un horario disponible</option>
                  {slots.map((d) => (
                    <option key={d.id_disponibilidad} value={d.id_disponibilidad}>
                      {d.fecha} • {d.hora_inicio}–{d.hora_fin}
                    </option>
                  ))}
                </select>
              </div>
              <div className="auth-actions">
                <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Agendar'}</Button>
              </div>
            </form>
            {error ? <p className="auth-feedback" style={{ color: 'crimson' }}>{error}</p> : null}
            {success ? <p className="auth-feedback" style={{ color: 'seagreen' }}>{success}</p> : null}
          </div>
        </div>
      </section>
      <section style={{ padding: '24px 16px', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 12px' }}>Tus citas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {citas.map((c, i) => (
              <div key={c?.id ?? i} style={{ background: '#f5f5f5', borderRadius: 12, padding: 12 }}>
                <strong>{c.motivo || 'Sin motivo'}</strong>
                {c.id_cliente ? <div style={{ marginTop: 6, color: '#374151' }}>Cliente: {c.id_cliente}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
